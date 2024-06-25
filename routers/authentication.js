import {Router} from "express";
import {clearSession, login} from "../lib/helpers.js";

const auth = Router();

auth.post("/register", async (req, res) => {
	const {name, surname, email, password} = req.body;

	const userId = await createUser({name, surname, email, password});

	await login({userId, password}, res)
		.then((sessionId) => {
			res.status(200);
		})
		.catch((error) => {
			if (error.status && error.message) {
				res.status(error.status).send({message: error.message});
			} else {
				res.status(500).json({message: "Internal server error"});
			}
		});
});

auth.post("/login", async (req, res) => {
	const {email, password} = req.body;

	await login({email, password}, res)
		.then((sessionId) => {
			res.status(200);
		})
		.catch((error) => {
			if (error.status && error.message) {
				res.status(error.status).send({message: error.message});
			} else {
				res.status(500).json({message: "Internal server error"});
			}
		});

	res.status(200);
});

auth.post("/logout", (req, res) => {
	clearSession(res);
	res.status(200);
});

export default auth;
