import express, { Request, Response } from "express"
import connectDB from "./config/database"
import userRoutes from "./routes/userRoutes"
import productRoutes from "./routes/productRoutes"

const app = express()
const PORT = process.env.PORT || 3000

connectDB()

// Middleware
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
	res.json({ message: "Hello TypeScript Express!" })
})

app.use("/users", userRoutes)
app.use("/products", productRoutes)

// Start server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
