import { useEffect, useState } from 'react'
import { Card as CardI } from '../pokemon/interfaces/card'
import { Set as SetI } from '../pokemon/interfaces/set'
import PokemonCard from './PokemonCard'
import { Container } from '@mui/system'
import { Card, LinearProgress, Typography } from '@mui/joy'
import { Wallet } from '../App'
import { getCardById } from '@/pokemon/api'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

export function UserViewBasic({ wallet, userId }: { wallet: Wallet, userId: string }) {
  const [cards, setCards] = useState<CardI[]>([])
  const [collections, setCollections] = useState<SetI[]>([])
  const [loading, setLoading] = useState(false)

  function updateCollections(cards: CardI[]) {
    let cols: SetI[] = []
    for (const card of cards) {
      if (cols.filter(col => col.id === card.set.id).length === 0)
        cols.push(card.set)
    }
    console.log(cols);
    setCollections(cols)
  }

  useEffect(() => {
    wallet?.contract.getNumberCardsOf(userId).then((num: number) => {
      console.log("getNumberCardsOf", num);
    })
  }, [wallet])

  useEffect(() => {
    setLoading(true)
    wallet?.contract.getCardsExtIdsOf(userId).then((ids: string) => {
      if (ids === '') {
        setLoading(false)
        return
      }
      console.log("ids", ids);
      Promise.all(ids.split('\n').filter(n => n != "").map(id => getCardById(id)))
        .then((allRes: any) => {
          console.log(allRes)
          updateCollections(allRes)
          setCards(allRes)
        })
        .finally(() => setLoading(false))
    })
  }, [wallet])

  return (loading
    ? <LinearProgress />
    : <Container className="mt-20">
      <Card sx={{ "--Card-padding": "0" }} >
        <div className="w-full pl-10 pb-5 pt-10 rounded-t-md" style={{ background: 'linear-gradient(to left, #F48FB1, #90CAF9)' }} >
          <Typography level="h1" component="div" textColor='neutral.50'>
            Votre collection des cartes
          </Typography>
        </div>
        <div className="flex flex-col gap-6 mx-10 my-5" >
          {collections.map((col, i) =>
            <motion.div
              key={col.id}
              initial={{ opacity: 0, scale: .9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, delay: i * .3 }}
              className="bg-gray-100 rounded-md"
            >
              <div className="flex flex-col items-center pt-5">
                <img src={col.images.logo} alt={col.name + "logo"} />
              </div>
              <div
                className="flex flex-row w-full overflow-x-auto overflow-y-hidden whitespace-nowrap gap-7 p-10"
              >
                {cards.filter(c => c.set.name === col.name).map((c, j) =>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: j * .1 }}
                  >
                    <PokemonCard pokemon={c} key={j} />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </Card>
    </Container>
  )
}

export default function UserView({ wallet }: { wallet: Wallet }) {
  let { id }: any = useParams()
  return <UserViewBasic wallet={wallet} userId={id} />
}
