import express, { Request, Response } from "express"
import Product from "../models/Product"
import natural from "natural"
import { italianConverter } from "italian-numbers"

const router = express.Router()
const tokenizer = new natural.WordTokenizer()

// Regex per il peso
const weightRegex =
	/(\d+(?:\.\d+)?)\s*(kg|kili|chili|chilo|kilo|hg|etto|etti|grammo|grammi|gr|g)/i

router.post("/search", async (req: Request, res: Response) => {
	try {
		const { query } = req.body
		if (!query) {
			return res.status(400).json({ error: "Search query is required" })
		}

		// 1. Convertire parole numeriche
		const transformedQuery = query.replace(/\b[a-z]+\b/gi, (match: string) => {
			const number = italianConverter(match)
			return !isNaN(number) ? number : match
		})

		// 2. Estrarre peso
		const weightMatch = transformedQuery.match(weightRegex)
		let requestedWeightInKg: number | null = null

		if (weightMatch) {
			const weightValue = parseFloat(weightMatch[1])
			const unit = weightMatch[2].toLowerCase()

			if (
				unit.startsWith("kg") ||
				unit.startsWith("ch") ||
				unit.startsWith("ki")
			) {
				requestedWeightInKg = weightValue
			} else if (unit.startsWith("hg") || unit.startsWith("ett")) {
				requestedWeightInKg = weightValue * 0.1
			} else if (unit.startsWith("gr") || unit === "g") {
				requestedWeightInKg = weightValue * 0.001
			}
		}

		// Pulire la query rimuovendo il peso
		const cleanQuery = transformedQuery.replace(weightRegex, "").trim()
		const queryTokens = tokenizer.tokenize(cleanQuery.toLowerCase())

		// 3. Recuperare i prodotti dal DB
		const allProducts = await Product.find()

		// 4. Matching dei prodotti
		const matches = allProducts.map((product) => {
			const productTokens = tokenizer.tokenize(product.name.toLowerCase())

			// Controllo token esatti
			const tokenMatch = queryTokens.some((qToken) =>
				productTokens.includes(qToken)
			)

			// Fuzzy matching su token singoli
			const tokenSimilarities = queryTokens.map((qToken) => {
				return productTokens.map((pToken) => {
					// Calcola solo se le parole hanno lunghezze simili
					if (Math.abs(qToken.length - pToken.length) <= 2) {
						return natural.JaroWinklerDistance(qToken, pToken)
					}
					return 0
				})
			})

			// Calcola il massimo grado di similarità tra i token
			const maxSimilarity = Math.max(
				...tokenSimilarities.flat().filter((val) => val > 0.7) // Soglia di 0.7
			)

			return {
				product,
				tokenMatch,
				maxSimilarity,
			}
		})

		// Filtra prodotti: richiede tokenMatch o similarità > 0.7
		const bestMatches = matches
			.filter((match) => match.tokenMatch || match.maxSimilarity > 0.7)
			.sort((a, b) => b.maxSimilarity - a.maxSimilarity)

		if (bestMatches.length === 0) {
			return res.status(404).json({ error: "No matching products found" })
		}

		// 5. Calcolo del prezzo
		const topMatch = bestMatches[0].product
		const totalPrice =
			requestedWeightInKg && topMatch.pricePerKg
				? (requestedWeightInKg * topMatch.pricePerKg).toFixed(2)
				: null

		const response = {
			product: topMatch,
			requestedWeight: requestedWeightInKg ? `${requestedWeightInKg} kg` : null,
			totalPrice: totalPrice,
		}

		res.json(response)
	} catch (error) {
		console.error("Search error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
})

export default router
