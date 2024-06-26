import {Router} from "express";
import DB from "../lib/connectors.js";

const notes = Router();

notes.use((req, res, next) => {
	if (!req.userDetails?.id) {
		res.status(401).send({message: "Unauthorized"});
		return;
	}
    next()
});

notes.get("", async (req, res) => {
	const {userDetails} = req;
	try {
		const notes = await DB.query("NOTES_TABLE", {user_id: userDetails?.id});

		res.json(notes);
	} catch (error) {
		console.error(error.stack);
		res.status(500).send({message: "Internal server error"});
	}
});

notes.get("/:id", async (req, res) => {
	try {
		const note = (await DB.read("NOTES_TABLE", {id: req.params.id}))[0];

		res.json(note);
	} catch (error) {
		console.error(error.stack);
		res.status(500).send({message: "Internal server error"});
	}
});

notes.post("", async (req, res) => {
	try {
		const {title, content} = req.body;

		if (!title || !content) {
			res.status(400).send({message: "Title and content are required"});
			return;
		}

		const id = await DB.create("NOTES_TABLE", {title, content, user_id: req.userDetails.id});

		const note = await DB.get("NOTES_TABLE", id);

		res.status(201).send(note);
	} catch (error) {
		console.error(error.stack);
		res.status(500).send({message: "Internal server error"});
	}
});

notes.put("/:id", async (req, res) => {
	try {
		const {title, content} = req.body;
		const {id} = req.params;

		if (!title || !content) {
			res.status(400).send({message: "Title and content are required"});
			return;
		}

		const note = await DB.get("NOTES_TABLE", req.params.id);
		if (note.user_id !== req.userDetails.id) {
			res.status(403).send({message: "Forbidden"});
			return;
		}

		await DB.update("NOTES_TABLE", {id, title, content});

		res.status(200).send({message: "Note updated"});
	} catch (error) {
		console.error(error.stack);
		res.status(500).send({message: "Internal server error"});
	}
});

notes.delete("/:id", async (req, res) => {
	try {
		const note = await DB.get("NOTES_TABLE", req.params.id);

		if (note.user_id !== req.userDetails.id) {
			res.status(403).send({message: "Forbidden"});
			return;
		}

		await DB.remove("NOTES_TABLE", req.params.id);

		res.sendStatus(204);
	} catch (error) {
		console.error(error.stack);
		res.status(500).send({message: "Internal server error"});
	}
});

export default notes;
