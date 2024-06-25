import express from "express";
import authRoute from "./routers/authentication.js";
import notesRoute from "./routers/notes.js";
import {assignCookies, getSessionDetails} from "./lib/helpers.js";
import bodyParser from "body-parser";

const jsonParser = bodyParser.json();

const app = express();

app.use(jsonParser);

app.use(async (req, res, next) => {
	if (process.env.IS_LOCAL) {
		console.log(`${req.method} ${req.path}`);
	}

	assignCookies(req);

	try {
		if (req.cookies?.session) {
			req.userDetails = await getSessionDetails(req.cookies.session);
		}
	} catch (error) {
		if (error.stack) console.error(error.stack);

		if (error.status && error.message) {
			res.status(error.status).send({message: error.message});
		} else {
			res.status(500).send({message: "Internal server error"});
		}
		return;
	}

	next();
});

app.use("/auth", authRoute);
app.use("/notes", notesRoute);

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Internal server error");
});

if (process.env.IS_LOCAL) {
	app.listen(process.env.SERVER_PORT, () => {
		console.log(`Server running on http://localhost:${process.env.SERVER_PORT}`);
	});
}
