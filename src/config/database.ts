import mongoose from "mongoose"

const connectDB = async () => {
	try {
		const mongoURI =
			process.env.MONGODB_URI ||
			"mongodb://rootuser:rootpass@localhost:27017/mydatabase"

		await mongoose.connect(mongoURI, {
			authSource: "admin",
		})

		console.log("MongoDB connected successfully")
	} catch (error) {
		console.error("MongoDB connection error:", error)
		// Exit process with failure
		process.exit(1)
	}
}

export default connectDB
