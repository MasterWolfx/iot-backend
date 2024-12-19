import express, { Request, Response } from "express"
import User from "../models/User"

const router = express.Router()

// Get all users
router.get("/", async (req: Request, res: Response) => {
	try {
		const users = await User.find()
		res.json(users)
	} catch (error) {
		res.status(500).json({ message: "Error fetching users" })
	}
})

// Create a new user
router.post("/", async (req: Request, res: Response) => {
	try {
		const { name, email } = req.body

		const newUser = new User({ name, email })
		await newUser.save()

		res.status(201).json(newUser)
	} catch (error) {
		res.status(500).json({ message: "Error creating user" })
	}
})

export default router
