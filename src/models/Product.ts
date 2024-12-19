import mongoose from "mongoose"

export interface IProduct extends mongoose.Document {
	name: string
	pricePerKg: number
	category: string
	origin?: string
	description?: string
	cut?: string
	qualityGrade?: string
}

const ProductSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	pricePerKg: {
		type: Number,
		required: true,
		min: 0,
	},
	category: {
		type: String,
		required: true,
		enum: ["Beef", "Pork", "Chicken", "Lamb", "Other"],
	},
	origin: {
		type: String,
	},
	description: {
		type: String,
	},
	cut: {
		type: String,
	},
	qualityGrade: {
		type: String,
		enum: ["Prime", "Choice", "Select", "Standard"],
	},
})

export default mongoose.model<IProduct>("Product", ProductSchema)
