export default function (error, req, res, next) {
	console.log("ERROR", error.message, req.method, req.path, error);
	if (!res.headersSent) {
		if (error.name === "TokenExpiredError") {
			return res
				.status(401)
				.json({ message: error.message, expiredAt: error.expiredAt });
		}
		if (error.name === "JsonWebTokenError") {
			return res.status(401).json({ message: error.message });
		}
		res.status(500).json({ message: error.message });
	}
}
