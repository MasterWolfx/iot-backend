import Product from "../models/Product"

const seedProducts = async () => {
	try {
		// Clear existing products
		await Product.deleteMany({})

		// Beef Products
		const beefProducts = [
			{
				name: "Beef Tenderloin",
				pricePerKg: 45.99,
				category: "Beef",
				origin: "Local Farm",
				cut: "Tenderloin",
				qualityGrade: "Prime",
			},
			{
				name: "Beef Sirloin",
				pricePerKg: 25.5,
				category: "Beef",
				origin: "Local Farm",
				cut: "Sirloin",
				qualityGrade: "Choice",
			},
			{
				name: "Ground Beef",
				pricePerKg: 15.99,
				category: "Beef",
				description: "Fresh ground beef, 80% lean",
			},
		]

		// Pork Products
		const porkProducts = [
			{
				name: "Pork Chops",
				pricePerKg: 18.99,
				category: "Pork",
				cut: "Loin Chop",
				origin: "Local Farm",
			},
			{
				name: "Pork Belly",
				pricePerKg: 12.5,
				category: "Pork",
				description: "Perfect for bacon",
			},
		]

		// Add more categories as needed

		await Product.insertMany([...beefProducts, ...porkProducts])
		console.log("Products seeded successfully")
	} catch (error) {
		console.error("Seeding error:", error)
	}
}

export default seedProducts
