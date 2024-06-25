import {Router} from "express";
import DB from "../lib/connectors.js";

const notes = Router();

notes.use((req, res, next) => {
	if (!req.userDetails?.userId) {
		res.status(401).send({message: "Unauthorized"});
		return;
	}
    next()
});

notes.get("", async (req, res) => {
	const {userDetails} = req;
	try {
		const notes = await DB.query("NOTES_TABLE", {user_id: userDetails?.userId});

		res.json(notes);
	} catch (error) {
		console.error(error.stack);
		res.status(500).send({message: "Internal server error"});
	}
});

notes.get("/:id", async (req, res) => {
	try {
		const note = await DB.read("NOTES_TABLE", {id: req.params.id});

		res.json(note);
	} catch (error) {
		console.error(error.stack);
		res.status(500).send({message: "Internal server error"});
	}
});

notes.post("", async (req, res) => {
	try {
		const {title, content} = req.body;

		await DB.create("NOTES_TABLE", {title, content, user_id: req.userDetails.userId});

		res.status(201).send({message: "Note created"});
	} catch (error) {
		console.error(error.stack);
		res.status(500).send({message: "Internal server error"});
	}
});

notes.put("/:id", async (req, res) => {
	try {
		const {title, content} = req.body;
		const {id} = req.params;

		await DB.update("NOTES_TABLE", {id, title, content});

		res.status(200).send({message: "Note updated"});
	} catch (error) {
		console.error(error.stack);
		res.status(500).send({message: "Internal server error"});
	}
});

notes.delete("/:id", async (req, res) => {
	try {
		await DB.delete("NOTES_TABLE", req.params.id);

		res.status(204);
	} catch (error) {
		console.error(error.stack);
		res.status(500).send({message: "Internal server error"});
	}
});

export default notes;
