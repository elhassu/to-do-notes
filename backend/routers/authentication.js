import {Router} from "express";
import {clearSession, createUser, login} from "../lib/helpers.js";

const auth = Router();

auth.post("/register", async (req, res) => {
	try {
		const {name, surname, email, password} = req.body;

		const userId = await createUser({name, surname, email, password});

		await login({userId, password}, res);

		res.sendStatus(200);
	} catch (error) {
		if (error.stack) console.error(error.stack);

		if (error.status && error.message) {
			res.status(error.status).send({message: error.message});
		} else {
			res.status(500).json({message: "Internal server error"});
		}
	}
});

auth.post("/login", async (req, res) => {
	try {
		const {email, password} = req.body;

		await login({email, password}, res);

		res.sendStatus(200);
	} catch (error) {
		if (error.stack) console.error(error.stack);

		if (error.status && error.message) {
			res.status(error.status).send({message: error.message});
		} else {
			res.status(500).json({message: "Internal server error"});
		}
	}
});

auth.post("/logout", async (req, res) => {
	try {
		await clearSession(req, res);

		res.sendStatus(200);
	} catch (error) {
		if (error.stack) console.error(error.stack);

		res.status(500).send({message: "Internal server error"});
	}
});

auth.get("/status", async (req, res) => {
	try {

		if (req.userDetails) {
			res.json(req.userDetails);
		} else {
			res.sendStatus(204);
		}
	} catch (error) {
		if (error.stack) console.error(error.stack);

		res.status(500).send({message: "Internal server error"});
	}
})

export default auth;
