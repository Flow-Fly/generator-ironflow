import { Router } from "express"
const router = Router()
// ℹ️ Handles password encryption
import bcrypt from "bcryptjs"
// Allow us to create and verify tokens
import jwt from "jsonwebtoken"
// User model
import User from "./../models/User.model.js"
// import necessary (isAuthenticated) middleware in order to control access to specific routes
import isAuthenticated from "./../middlewares/isAuthenticated.js"

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10

// POST /auth/signup  - Creates a new user in the database
router.post("/signup", async (req, res, next) => {
	try {
		const { username, email, password } = req.body

		// Check if username or password  are provided as empty strings
		if (username === "" || password === "" || email === "") {
			res.status(400).json({
				message: "Please provide a username, email and password combo.",
			})
			return
		}

		// This regular expression checks password for special characters and minimum length
		// For your own sanity, comment the next lines while in developement.
		const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/
		if (!passwordRegex.test(password)) {
			res.status(400).json({
				message:
					"Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
			})
			return
		}

		// Check the users collection if a user with the same email already exists
		const foundUser = await User.findOne({ email })
		// If the user with the same email already exists, send an error response
		if (foundUser) {
			res.status(400).json({ message: "User already exists." })
			return
		}

		// If email is unique, proceed to hash the password
		const salt = await bcrypt.genSalt(saltRounds)
		const hashedPassword = await bcrypt.hash(password, salt)

		// Create the new user in the database
		// We return a pending promise, which allows us to chain another `then`
		const createdUser = await User.create({
			username,
			email,
			password: hashedPassword,
		})

		// Send a json response containing the user object
		res.status(201).json(createdUser)
	} catch (error) {
		next(error)
	}
})

// POST  /auth/login - Verifies email and password and returns a JWT
router.post("/login", async (req, res, next) => {
	const { email, password } = req.body
	try {
		// Check if email or password are provided as empty string
		if (email === "" || password === "") {
			res.status(400).json({ message: "Provide email and password." })
			return
		}

		// Check the users collection if a user with the same email exists
		const foundUser = await User.findOne({ email }).select("password")
		if (!foundUser) {
			// If the user is not found, send an error response
			res.status(401).json({ message: "User not found." })
			return
		}

		// Compare the provided password with the one saved in the database
		const passwordCorrect = await bcrypt.compare(password, foundUser.password)

		if (passwordCorrect) {
			// Create an object that will be set as the token payload
			const payload = { _id: foundUser._id }

			// Create a JSON Web Token and sign it
			const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
				algorithm: "HS256",
				expiresIn: "12h",
			})

			// Send the token as the response
			res.status(200).json({ authToken: authToken })
		} else {
			res.status(401).json({ message: "Unable to authenticate the user" })
		}
	} catch (error) {
		next(error)
	}
})

// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get("/verify", isAuthenticated, (req, res, next) => {
	// If JWT token is valid the payload gets decoded by the
	// isAuthenticated middleware and is made available on `req.payload`
	console.log(`req.user`, req.user)

	// Send back the token object containing the user data
	res.status(200).json(req.user)
})

export default router
