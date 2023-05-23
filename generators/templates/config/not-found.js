export default function (req, res, next) {
	return res.status(404).json({
		message: `No route matched for the requested URL`,
		requestedUrl: req.originalURL,
	});
}
