import { Card } from './interfaces/card'

const backend = 'http://localhost:3000'

export async function getCardById(id: string): Promise<Card> {
  const res = await fetch(`${backend}/cards/${id}`)
  const json = await res.json()
  return json.data
}

export async function getCardsByName(
  name: string,
  page: number = 1
): Promise<Card[]> {
  const res = await fetch(`${backend}/cards?q=name:*${name}*&page=${page}`)
  const json = await res.json()
  return json.data
}
