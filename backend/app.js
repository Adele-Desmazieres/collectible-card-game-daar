import express from 'express'
import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

const app = express()
const port = 3000
const api = "https://api.pokemontcg.io/v2"

const options = {
	transformResponse: (res) => { return res },
	headers: { 'X-Api-Key': process.env.POKEMONTCG_API_KEY }
}

// cards
app.get('/card/all/:pageNo?', async (req, res) => {
	try {
		const params = `page=${req.params.pageNo ?? 1}&pageSize=10`
		const cards = await axios.get(`${api}/cards?${params}`, options)
		res.type('json')
		res.send(cards.data)
	} catch (e) {
		console.log(e)
		res.sendStatus(501)
	}
})

app.get('/card/by-id/:cardId', async (req, res) => {
	try {
		const card = await axios.get(`${api}/cards/${req.params.cardId}`, options)
		res.type('json')
		res.send(card.data)
	} catch (e) {
		console.log(e)
		res.sendStatus(503)
	}
})

app.get('/card/by-name/:cardName/:pageNo?', async (req, res) => {
	try {
		const { cardName, pageNo } = req.params
		const params = `q=name:${cardName}&page=${pageNo ?? 1}&pageSize=10`
		const card = await axios.get(`${api}/cards?${params}`, options)
		res.type('json')
		res.send(card.data)
	} catch (e) {
		console.log(e)
		res.sendStatus(503)
	}
})

// sets
app.get('/sets/:pageNo?', async (req, res) => {
	try {
		const params = `page=${req.params.pageNo ?? 1}&pageSize=10`
		const sets = await axios.get(`${api}/sets?${params}`, options)
		res.send(sets.data)
	} catch (e) {
		console.log(e)
		res.sendStatus(501)
	}
})

app.get('/types', (_, res) => {
	res.json([
		"Colorless",
		"Darkness",
		"Dragon",
		"Fairy",
		"Fighting",
		"Fire",
		"Grass",
		"Lightning",
		"Metal",
		"Psychic",
		"Water"
	])
})

app.get('/subtypes', (_, res) => {
	res.json([
		"BREAK",
		"Baby",
		"Basic",
		"EX",
		"GX",
		"Goldenrod Game Corner",
		"Item",
		"LEGEND",
		"Level-Up",
		"MEGA",
		"Pokémon Tool",
		"Pokémon Tool F",
		"Rapid Strike",
		"Restored",
		"Rocket's Secret Machine",
		"Single Strike",
		"Special",
		"Stadium",
		"Stage 1",
		"Stage 2",
		"Supporter",
		"TAG TEAM",
		"Technical Machine",
		"V",
		"VMAX"
	])
})

app.get('/supertypes', (_, res) => {
	res.json([
		"Energy",
		"Pokémon",
		"Trainer"
	])
})

app.get('/rarities', (_, res) => {
	res.json([
		"Amazing Rare",
		"Common",
		"LEGEND",
		"Promo",
		"Rare",
		"Rare ACE",
		"Rare BREAK",
		"Rare Holo",
		"Rare Holo EX",
		"Rare Holo GX",
		"Rare Holo LV.X",
		"Rare Holo Star",
		"Rare Holo V",
		"Rare Holo VMAX",
		"Rare Prime",
		"Rare Prism Star",
		"Rare Rainbow",
		"Rare Secret",
		"Rare Shining",
		"Rare Shiny",
		"Rare Shiny GX",
		"Rare Ultra",
		"Uncommon"
	])
})


app.listen(port, () => {
	console.log('backend listening on port ' + port)
})
