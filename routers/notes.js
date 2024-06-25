import {Router} from "express";

const notes = Router();

notes.get("", (req, res) => {
	res.send("Notes page");
});

notes.get("/:id", (req, res) => {
	res.send("Note page");
});

notes.post("", (req, res) => {
	res.send("Create note page");
});

notes.put("/:id", (req, res) => {
	res.send("Edit note page");
});

notes.delete("/:id", (req, res) => {
	res.send("Delete note page");
});

export default notes;
