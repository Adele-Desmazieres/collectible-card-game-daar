import { Card } from './interfaces/card'

const backend = 'http://localhost:3000'

export async function getCardById(id: string): Promise<Card> {
  const res = await fetch(encodeURI(`${backend}/cards/by-id/${encodeURIComponent(id)}`))
  const json = await res.json()
  return json.data
}

export async function getCardsBySet(id: string): Promise<Card[]> {
  const res = await fetch(`${backend}/cards/by-set/${id}`)
  const json = await res.json()
  return json.data
}
