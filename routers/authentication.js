import {Router} from "express";
import {setSession, clearSession} from "../lib/helpers.js";

const auth = Router();

auth.post("/register", (req, res) => {

    const session = 4

    setSession(session, res)
    res.status(200);
});

auth.get("/login", (req, res) => {

    const session = 4

    setSession(session, res)
	res.status(200);
});

auth.get("/logout", (req, res) => {

    clearSession(res)
    res.status(200);
});

export default auth;