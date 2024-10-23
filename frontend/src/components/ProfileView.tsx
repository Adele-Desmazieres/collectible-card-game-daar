import { useEffect, useState } from 'react'
import { Card as CardI } from '../pokemon/interfaces/card'
import PokemonCard from './PokemonCard'
import { getCardsByName } from '../pokemon/api'
import { Container } from '@mui/system'
import { LinearProgress } from '@mui/material'
import { Wallet } from '../App'

export default function ProfileView({ wallet }: { wallet: Wallet }) {
  const [cards, setCards] = useState<CardI[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getCardsByName("dark")
      .then(res => {
        setCards(res)
      })
      .finally(() => setLoading(false))
  }, [])

  return (loading
    ? <LinearProgress />
    : <Container className="grid grid-cols-4 gap-5">
      {cards.map(c => <PokemonCard pokemon={c} key={c.id} />)}
    </Container>
  )
}
