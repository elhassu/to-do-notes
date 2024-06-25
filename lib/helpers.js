export function assignCookies(req) {
	req.cookies = req.headers.cookie.split(";").reduce((acc, c) => {
		const [key, val] = c.trim().split("=").map(decodeURIComponent);
		acc[key] = val;
		return acc;
	}, {});

    return cookies;
}

export function setSession(session, res) {
    res.cookie("session", session);
}

export function clearSession(res) {
    res.clearCookie("session");
}