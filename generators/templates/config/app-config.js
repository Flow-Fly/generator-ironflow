import express from "express";
import morgan from "morgan";
import cors from "cors";

export default function configuration(app) {
	// morgan allow us to have some nice logs of all of the incoming requests.
	app.use(morgan("dev"));
	// Parse the request with a body containing JSON.
	app.use(express.json());
	// Parse the request with a body containing a urlencoded form.
	app.use(express.urlencoded({ extended: true }));
	// Allow the frontend to make request to our backend.
	app.use(
		cors({
			origin: process.env.ORIGIN,
		})
	);
}

/**
 * This is called an IIFE
 * Immediately Invoked Function Execution
 * Basically it's a function which is directly executed :)
 */
(function () {
	const missingEnv = [];
	if (!process.env.ORIGIN) {
		missingEnv.push("ORIGIN");
	}
	if (!process.env.MONGODB_URI) {
		missingEnv.push("MONGODB_URI");
	}
	if (!process.env.TOKEN_SECRET) {
		missingEnv.push("TOKEN_SECRET");
	}
	// Add cloudinary checks if setup require cloudinary

	if (missingEnv.length) {
		throw Error(`Missing variable in your .env file: ${missingEnv.join(" ")}`);
	}
})();
