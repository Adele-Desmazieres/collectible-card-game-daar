import { useEffect, useState } from 'react'
import { Card as CardI } from '../pokemon/interfaces/card'
import { Set as SetI } from '../pokemon/interfaces/set'
import PokemonCard from './PokemonCard'
import { Container } from '@mui/system'
import { Card, LinearProgress, Select, Typography, Option } from '@mui/joy'
import { Wallet } from '../App'
import { getCardById } from '@/pokemon/api'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Type } from '@/pokemon/enums/type'

function ColumnView({ cards, col, i }: { cards: CardI[], col: SetI, i: number }) {
  return (
    <motion.div
      key={'set' + i}
      className="bg-gray-100 rounded-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, delay: i * .2, exit: { delay: .1 } }}
    >
      <div className="flex flex-col items-center pt-5">
        <img src={col.images.logo} alt={col.name + "logo"} className='max-h-52' />
      </div>
      <div className="flex flex-row w-full overflow-x-auto overflow-y-hidden whitespace-nowrap gap-7 p-10" >
        {cards.filter(c => c.set.name === col.name).map((c, j) =>
          <motion.div
            key={'setCard' + j}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: .1 + j * .1 }}
          >
            <PokemonCard pokemon={c} key={j} />
          </motion.div>
        )}
      </div>
    </motion.div>)
}

function TypeView({ cards, type, i }: { cards: CardI[], type: Type, i: number }) {
  return (
    <motion.div
      key={'type' + i}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, delay: i * .2, exit: { delay: .1 } }}
      className="bg-gray-100 rounded-md"
    >
      <div className="px-10 pt-10">
        <Typography level="h2" textColor="neutral.700">
          {type}
        </Typography>
      </div>
      <div
        className="flex flex-row w-full overflow-x-auto overflow-y-hidden whitespace-nowrap gap-7 p-10"
      >
        {cards.filter(c => c.types?.includes(type)).map((c, j) =>
          <motion.div
            key={'typeCard' + j}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: .2 + j * .1, exit: { delay: .1 } }}
          >
            <PokemonCard pokemon={c} key={j} />
          </motion.div>
        )}
      </div>
    </motion.div>)
}

export function UserViewBasic({ wallet, userId }: { wallet: Wallet, userId: string }) {
  const [cards, setCards] = useState<CardI[]>([])
  const [collections, setCollections] = useState<SetI[]>([])
  const [types, setTypes] = useState<Type[]>([])
  const [loading, setLoading] = useState(false)
  const [ordering, setOrdering] = useState('set')

  function updateCollections(cards: CardI[]) {
    let cols: SetI[] = []
    for (const card of cards) {
      if (cols.filter(col => col.id === card.set.id).length === 0)
        cols.push(card.set)
    }
    setCollections(cols)
  }
  function updateTypes(cards: CardI[]) {
    let types: Type[] = []
    for (const card of cards) {
      if (!card.types) continue
      for (const type of card.types) {
        if (!types.includes(type)) {
          types.push(type)
        }
      }
    }
    setTypes(types)
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
          updateTypes(allRes)
          setCards(allRes)
        })
        .finally(() => setLoading(false))
    })
  }, [wallet])

  return (loading
    ? <LinearProgress />
    : <Container className="mt-20">
      <Card sx={{ "--Card-padding": "0" }} >
        <div className="flex justify-between w-full px-10 pb-5 pt-10 rounded-t-md" style={{ background: 'linear-gradient(to left, #F48FB1, #90CAF9)' }} >
          <Typography level="h1" component="div" textColor='neutral.50'>
            Your collection
          </Typography>
          <div className="flex items-center gap-2">
            <Typography level="body-md" textColor="neutral.50">
              Sort by:
            </Typography>

            <Select defaultValue="set" value={ordering} placeholder="Order by" onChange={(_, v: any) => setOrdering(v)}>
              <Option value="set">Collection</Option>
              <Option value="name">Name</Option>
              <Option value="type">Type</Option>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-6 mx-10 my-5" >
          {ordering === 'name'
            ? <motion.div
              key="name"
              className="grid grid-cols-4 gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[...cards].sort((c1, c2) => c1.name.localeCompare(c2.name)).map((c, i) =>
                <motion.div
                  key={'card' + i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * .05 }}
                >
                  <PokemonCard pokemon={c} />
                </motion.div>
              )}
            </motion.div>
            : ordering === 'set'
              ? collections
                .sort((c1, c2) => c1.name.localeCompare(c2.name))
                .map((col, i) => <ColumnView cards={cards} col={col} i={i} key={'set' + i} />)
              /* type */
              : types
                .sort((t1, t2) => t1.localeCompare(t2))
                .map((type, i) => <TypeView cards={cards} type={type} i={i} key={'type' + i} />)
          }
        </div>
      </Card>
    </Container>
  )
}

export default function UserView({ wallet }: { wallet: Wallet }) {
  let { id }: any = useParams()
  return <UserViewBasic wallet={wallet} userId={id} />
}
