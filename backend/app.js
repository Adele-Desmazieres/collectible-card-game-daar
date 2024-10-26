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

/**
 * Asynchronous handler for server requests, processes client request data,
 * and sends an appropriate response.
 * 
 * @async
 * @function serverFn
 * @param {express.Request} req - The Express request object, containing details about 
 *                                the HTTP request.
 * @param {Object} req.params - Route parameters extracted from the URL.
 * @param {Object} req.query - Query string parameters in the URL.
 * @param {Object} req.body - Data sent by the client in a POST or PUT request.
 * @param {string} req.method - HTTP method used for the request (e.g., "GET", "POST").
 * @param {Object} req.headers - HTTP headers sent by the client.
 * 
 * @param {express.Response} res - The Express response object, allowing you to 
 *                                 send a response to the client.
 * @param {Function} res.status - Sets the HTTP status code for the response.
 * @param {Function} res.json - Sends a JSON response.
 * @param {Function} res.send - Sends an HTTP response.
 * @param {Function} res.redirect - Redirects the client to a different URL.
 * 
 * @param {function(): void} callback
 * 
 * @returns {Promise<void>} - Resolves when the response has been sent or rejects 
 *                            if an error occurs.
 */
async function serverFnWrapper(_, res, callback) {
	try {
		callback()
	} catch (e) {
		console.error(e)
		res.sendStatus(500)
	}
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

app.get('/cards/:id', async (req, res) => serverFnWrapper(req, res, async () => {
	const cards = await axios.get(`${api}/cards/${req.params.id}`, options)
	res.type('json')
	res.send(cards.data)
}))

app.listen(port, () => {
	console.log('backend listening on port ' + port)
})
