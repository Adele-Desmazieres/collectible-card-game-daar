import { useEffect, useState } from 'react'
import { Card as CardI } from '../pokemon/interfaces/card'
import PokemonCard from './PokemonCard'
import { Container } from '@mui/system'
import { LinearProgress } from '@mui/joy'
import { Wallet } from '../App'
import { getCardById } from '@/pokemon/api'
import { useParams } from 'react-router-dom'

export function UserViewBasic({ wallet, userId }: { wallet: Wallet, userId: string }) {
  const [cards, setCards] = useState<CardI[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    wallet?.contract.getCardsIdsOf(userId).then((ids: string) => {
      if (ids === '') {
        setLoading(false)
        return
      }
      console.log("ids", ids);
      Promise.all(ids.split('\n').filter(n => n != "").map(id => getCardById(id)))
        .then((allRes: any) => {
          console.log(allRes)
          setCards(allRes)
        })
        .finally(() => setLoading(false))
    })
  }, [wallet])

  return (loading
    ? <LinearProgress />
    : <Container className="grid grid-cols-4 gap-5 h-lvh">
      {cards.map(c => <PokemonCard pokemon={c} key={c.id} />)}
    </Container>
  )
}

export default function UserView({ wallet }: { wallet: Wallet }) {
  let { userId }: any = useParams()
  return <UserViewBasic wallet={wallet} userId={userId} />
}
