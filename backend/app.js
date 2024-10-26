import express from 'express'
import dotenv from 'dotenv'
import axios from 'axios'
import cors from 'cors'

dotenv.config()

const app = express()
const port = 3000
const api = "https://api.pokemontcg.io/v2"

app.use(cors())
const options = {
	transformResponse: (res) => { return res },
	headers: { 'X-Api-Key': process.env.POKEMONTCG_API_KEY }
}

function logError(error) {
	if (error.response) {
		// Server responded with a status code outside 2xx
		console.error('Response error:', error.response.data);
		console.error('Status:', error.response.status);
		console.error('Headers:', error.response.headers);
	} else if (error.request) {
		// Request was made but no response received
		console.error('No response:', error.request);
	} else {
		// Error in setting up the request
		console.error('Error setting up request:', error.message);
	}
	console.error('Error config:', error.config);
}

app.get('/cards/by-id/:id', async (req, res) => {
	try {
		const cards = await axios.get(`${api}/cards/${req.params.id}`, options)
		res.type('json')
		res.send(cards.data)
	} catch (e) {
		logError(e)
		res.sendStatus(500)
	}
})

app.get('/cards/by-set/:setid', async (req, res) => {
	try {
		const cards = await axios.get(`${api}/cards?q=set.id:${req.params.setid}`, options)
		res.type('json')
		res.send(cards.data)
	} catch (e) {
		logError(e)
		res.sendStatus(500)
	}
})

app.get('/sets/all', async (_, res) => {
	try {
		const cards = await axios.get(`${api}/sets?select=id,name`, options)
		res.type('json')
		res.send(cards.data)
	} catch (e) {
		logError(e)
		res.sendStatus(500)
	}
})

app.get('/sets/:id', async (req, res) => {
	try {
		const cards = await axios.get(`${api}/sets/${req.params.id}`, options)
		res.type('json')
		res.send(cards.data)
	} catch (e) {
		logError(e)
		res.sendStatus(500)
	}
})

app.listen(port, () => {
	console.log('backend listening on port ' + port)
})
