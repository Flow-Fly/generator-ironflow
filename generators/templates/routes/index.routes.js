import { Router } from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import authRoutes from "./auth.routes.js"
const router = Router()

router.get("/", (req, res, next) => {
	res.json({ message: "Cruding everyday!" })
})

// Routes that don't need authentication
router.use("/auth", authRoutes)

// Protected routes
router.use(isAuthenticated)
// All of the protected routes here.

export default router
