import { Card } from "./pokemon/interfaces/card";

const api = "http://localhost:3000"

export async function getCardById(id: string): Promise<Card> {
  const res = await fetch(`${api}/card/by-id/${id}`)
  const json = await res.json()
  return json.data
}

export async function getCardsByName(name: string, page: number = 1): Promise<Card> {
  const res = await fetch(`${api}/card/by-name/${name}/${page}`)
  const json = await res.json()
  return json.data
}
