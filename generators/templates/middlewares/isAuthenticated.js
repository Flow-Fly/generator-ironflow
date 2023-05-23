import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
export default async function (req, res, next) {
	const auth = req.get("authorization");
	if (!auth) {
		return res
			.status(401)
			.json({ message: "No authorization on the request." });
	}
	const token = auth.split(" ")[1];
	if (!token) {
		return res.status(401).json({ message: "No token after Bearer." });
	}
	try {
		const payload = jwt.verify(token, process.env.TOKEN_SECRET);
		const user = await User.findById(payload.id);
		req.user = user;
		// Everything went well go to the next route
		next();
	} catch (error) {
		next(error);
	}
}
