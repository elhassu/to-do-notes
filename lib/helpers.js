import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import DB from "../lib/connectors.js"

Date.prototype.toSQLString = function () {
    return this.toISOString().slice(0, 19).replace('T', ' ');
}

export function assignCookies(req) {
	req.cookies = req.headers.cookie?.split(";").reduce((acc, c) => {
		const [key, val] = c.trim().split("=").map(decodeURIComponent);
		acc[key] = val;
		return acc;
	}, {});
}

export function setSession(session, res) {
	res.cookie("session", session);
    console.log("Session set!");
}

export async function clearSession(req, res) {

    if (!req.cookies.session) {
        return;
    }

    const session = (await DB.read("SESSION_TABLE", { identifier: req.cookies.session }))[0];

    await DB.update("SESSION_TABLE", {id: session.id, expires_at: new Date().toSQLString()});

	res.clearCookie("session");
    console.log("Session cleared!")
}

export async function getSessionDetails(session) {
    const sessionDetails = (await DB.read("SESSION_TABLE", { identifier: session }))[0];

    if (!sessionDetails) {
        throw { status: 401, message: "Invalid session" }
    }

    if (sessionDetails.expires_at < new Date().toSQLString()){
        throw { status: 403, message: "Session expired" }
    }

    return {
        userId: sessionDetails?.user_id,
        expiresAt: sessionDetails?.expires_at
    }
}

function encrypt(plain) {
	return new Promise((resolve, reject) => {
		const saltRounds = 10;

		bcrypt.hash(plain, saltRounds, function (err, hash) {
			resolve(hash);
		});
	});
}

export function compare(plain, hash) {
	return new Promise((resolve, reject) => {
		bcrypt.compare(plain, hash, function (err, result) {
			resolve(result);
		});
	});
}

export function formatEmail(email) {
    // this regex matches the string between the "+" and the "@" in an email address
    const emailParam = email.match(/(?<=\+)(.*?)(?=@)/)?.[0];

    if (emailParam) {
        email = email.replace(`+${emailParam[0]}`, "");
        const formatted = email.toLowerCase().trim();
        const [emailUser, domain] = formatted.split("@");
        email = `${emailUser}+${emailParam}@${domain}`;
    }

    return email;
}

export async function createUser(user) {
	let {name, surname, email, password} = user;

    email = formatEmail(email);

    const existingUser = (await DB.read("USER_TABLE", { email }))[0];

    if (existingUser) {
        throw { status: 409, message: "User already exists" };
    }

	const userId = await DB.create("USER_TABLE", {name, surname, email});


	if (password) {
		const encryptedPassword = await encrypt(password);
		await DB.create("PASSWORD_TABLE", {user_id: userId, password: encryptedPassword});
	}

	return userId;
}

export async function createSession(userId) {
	const expires_at = new Date(new Date().getTime() + 4 * 60 * 60 * 1000);
    const identifier = uuidv4();

	await DB.create("SESSION_TABLE", { user_id: userId, identifier, expires_at});

    return identifier;
}

export function login({ userId, email, password }, res) {
    return new Promise(async (resolve, reject) => {
        if (!userId && !email) reject({ status: 400, message: "User ID or email is required" })
        if (!password) reject({ status: 400, message: "Password is required" })

        if (!userId && email) {
            const user = (await DB.read("USER_TABLE", { email }))[0];

            if (!user) reject({ status: 404, message: "User not found" });
            userId = user.id;
        }

        const passwordHash = (await DB.read("PASSWORD_TABLE", {user_id: userId}))[0].password;

        const match = await compare(password, passwordHash);

        if (match) {
            const sessionId = await createSession(userId);
            setSession(sessionId, res);
            resolve(sessionId);
        } else {
            reject({ status: 401, message: "Incorrect Password" });
        }
    })
}