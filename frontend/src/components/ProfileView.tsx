import { useEffect, useState } from 'react'
import { Card as CardI } from '../pokemon/interfaces/card'
import PokemonCard from './PokemonCard'
import { getCardsByName } from '../pokemon/api'
import { Container } from '@mui/system'
import { Button, CircularProgress, LinearProgress, TextField } from '@mui/material'
import { Card, CardContent, Typography } from '@mui/material'
import { Wallet } from '../App'

export default function ProfileView({ wallet }: { wallet: Wallet }) {
  const [cards, setCards] = useState<CardI[]>([])
  const [loading, setLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [newCardUri, setNewCardUri] = useState("")
  const [newCardCollection, setNewCardCollection] = useState("")
  const [newCardSaving, setNewCardSaving] = useState(false)

  useEffect(() => {
    setLoading(true)
    getCardsByName("dark")
      .then(res => {
        setCards(res)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    wallet?.contract.isAdmin().then((res: boolean) => {
      console.log(res);
      setIsAdmin(res)
    })
  }, [])

  function addCard() {
    const adr = wallet?.details.signer?.getAddress()
    setNewCardSaving(true)
    wallet?.contract.mintCard(adr, newCardCollection, newCardUri).finally(() => setNewCardSaving(false))
  }

  return (loading
    ? <LinearProgress />
    : <Container className="flex flex-col gap-5 p-10 bg-transparent">
      {isAdmin &&
        <Card className="flex flex-col gap-2">
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Nouvelle Carte
            </Typography>
            <div className="grid grid-cols-[2fr_5fr_1fr] gap-5">
              <TextField placeholder="Collection" variant="outlined" onChange={(e) => setNewCardCollection(e.target.value)} />
              <TextField placeholder="URL" variant="outlined" onChange={(e) => setNewCardUri(e.target.value)} />
              <Button variant="contained" disabled={!newCardSaving} onClick={addCard}>
                {newCardSaving ? <CircularProgress /> : "Créer"}
              </Button>
            </div>
          </CardContent>
        </Card>
      }
      <div className="grid grid-cols-4 gap-5">
        {cards.map(c => <PokemonCard pokemon={c} key={c.id} />)}
      </div>
    </Container>
  )
}
