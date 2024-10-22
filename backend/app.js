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

app.get('/:query', async (req, res) => {
	try {
		let queryStr = ""
		for (const k in req.query) queryStr += `&${k}=${req.query[k]}`
		queryStr = queryStr.substring(1)
		const cards = await axios.get(`${api}/${req.params.query}?${queryStr}`, options)
		res.type('json')
		res.send(cards.data)
	} catch (e) {
		console.log(e)
		res.sendStatus(500)
	}
})

app.listen(port, () => {
	console.log('backend listening on port ' + port)
})
