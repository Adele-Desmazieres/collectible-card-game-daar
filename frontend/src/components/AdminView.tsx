import { Card, CircularProgress, Container, Typography, Button, Input, Snackbar, Autocomplete } from "@mui/joy";
import { Wallet } from "../App";
import { useEffect, useState } from "react";
import * as ethereum from '@/lib/ethereum'
import { ethers } from "ethers";
import { getCardsBySet } from "@/pokemon/api";
import { motion } from 'framer-motion'

export default function AdminView({ wallet }: { wallet: Wallet }) {
  const [newCardId, setNewCardId] = useState("")
  const [newCardCollection, setNewCardCollection] = useState("")
  const [newCardAmount, setNewCardAmount] = useState(1)
  const [newCardSaving, setNewCardSaving] = useState(false)

  const [newCollection, setNewCollection] = useState("")
  const [newCollectionSaving, setNewCollectionSaving] = useState(false)

  const [newBoosterCollection, setNewBoosterCollection] = useState("")
  const [newBoosterSaving, setNewBoosterSaving] = useState(false)

  const [isAdmin, setIsAdmin] = useState(false)
  const [isAdminReq, setIsAdminReq] = useState(true)

  const [collections, setCollections] = useState<string[]>([])
  const [collectionsLoading, setCollectionsLoading] = useState(true)

  const [snackBars, setSnackBars] = useState<{ msg: string, open: boolean }[]>([])

  function adminCheck() {
    setIsAdminReq(true)
    wallet?.contract.isAdmin()
      .then((res: boolean) => setIsAdmin(res))
      .finally(() => setIsAdminReq(false))
  }

  function updateCollections() {
    console.log("update collections");
    setCollectionsLoading(true)
    wallet?.contract.getCollections()
      .then((cols: string[]) => setCollections(cols))
      .finally(() => setCollectionsLoading(false))
  }

  function notifyTransaction(tx: ethers.providers.TransactionResponse) {
    tx.wait().then((receipt: ethers.providers.TransactionReceipt) => {
      const msg = receipt.status === 1
        ? "Transaction confirmed in block " + receipt.blockNumber
        : "Transaction failed"

      console.log(msg);
      setSnackBars([...snackBars, { msg, open: true }])
    })
  }

  useEffect(() => wallet && adminCheck(), [wallet])
  useEffect(() => wallet && updateCollections(), [wallet])
  useEffect(() => {
    const adminCheckCanceler = ethereum.accountsChanged(adminCheck)
    return function cleanup() { adminCheckCanceler() }
  }, [])

  function addCard() {
    const adr = wallet?.details.account
    setNewCardSaving(true)
    for (let i = 0; i < newCardAmount; i++) {
      wallet?.contract.giveNewCard(adr, newCardCollection, newCardId)
        .then((tx: ethers.providers.TransactionResponse) => {
          notifyTransaction(tx)
          setNewCardSaving(false)
        })
        .catch((e: any) => {
          console.log(e)
          setNewCollectionSaving(false)
        })
    }
  }

  function addCollection() {
    setNewCollectionSaving(true)
    wallet?.contract.createCollection(newCollection)
      .then((tx: ethers.providers.TransactionResponse) => {
        notifyTransaction(tx)
        // jsp pq sans le timeout ça fonctionne pas
        setTimeout(() => {
          updateCollections()
          setNewCollectionSaving(false)
        }, 500)
      })
      .catch((e: any) => {
        console.log(e)
        setNewCollectionSaving(false)
      })
  }

  function getRandomElements<T>(arr: T[], count: number) {
    if (count > arr.length) throw new Error("Count exceeds array length");

    const result = [];
    const usedIndices = new Set();

    while (result.length < count) {
      const randomIndex = Math.floor(Math.random() * arr.length);

      if (!usedIndices.has(randomIndex)) {
        result.push(arr[randomIndex]);
        usedIndices.add(randomIndex);
      }
    }

    return result;
  }

  function addBooster() {
    setNewBoosterSaving(true)
    getCardsBySet(newBoosterCollection).then((cards) => {
      const randomCards = getRandomElements(cards, 8)
      const adr = wallet?.details.account
      wallet?.contract.giveNewBooster(adr, newBoosterCollection, randomCards.map(card => card.id))
        .then((tx: ethers.providers.TransactionResponse) => {
          notifyTransaction(tx)
          setNewBoosterSaving(false)
        })
        .catch((e: any) => {
          console.log(e)
          setNewBoosterSaving(false)
        })
    })
  }

  return (
    <Container className="mt-20">
      <Card className="flex justify-center items-center min-h-28" sx={{ "--Card-padding": "0" }} >
        <div className="w-full pl-10 pb-5 pt-10 rounded-t-md" style={{ background: 'linear-gradient(to left, #F48FB1, #90CAF9)' }} >
          <Typography level="h1" component="div" textColor='neutral.50'>
            Page d'admin
          </Typography>
        </div>
        {snackBars.map((sb, i) =>
          <Snackbar
            key={i}
            open={sb.open}
            autoHideDuration={5000}
            onClose={() => setSnackBars(snackBars.map(sb_ => sb.msg === sb_.msg ? { msg: sb.msg, open: false } : sb_))}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >{sb.msg}</Snackbar>)}
        {isAdminReq ? <CircularProgress /> :
          !isAdmin ? <h1 className="m-auto">Not an admin</h1> :
            <div className="mb-10 mt-2 flex flex-col gap-5 mx-10">
              <motion.div
                className="border border-gray-200 rounded-md py-10 px-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: .2 }}
              >
                <Typography gutterBottom level="h2" component="div" textColor="neutral.700">
                  Nouvelle carte
                </Typography>
                <div className="grid grid-cols-[3fr_1fr_2fr_1fr] gap-5">
                  <Input placeholder="ID de la carte Pokémon TCG" variant="outlined" onChange={(e) => setNewCardId(e.target.value)} />
                  <Input placeholder="Nb de carte" variant="outlined" type="number" onChange={(e) => setNewCardAmount(e.target.value as any as number)} />
                  <Autocomplete placeholder="Collection" options={collectionsLoading ? [] : collections}
                    onInputChange={(_, newInputValue) => {
                      setNewCardCollection(newInputValue);
                    }} />
                  <Button disabled={newCardSaving} onClick={addCard} color="neutral">
                    {newCardSaving ? <CircularProgress /> : "Créer carte"}
                  </Button>
                </div>
              </motion.div>
              <motion.div
                className="border border-gray-200 rounded-md py-10 px-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: .4 }}
              >
                <Typography gutterBottom level="h2" component="div" textColor="neutral.700">
                  Nouvelle collection
                </Typography>
                <div className="grid grid-cols-[6fr_1fr] gap-5">
                  <Input placeholder="Nom de la collection" variant="outlined" onChange={(e) => setNewCollection(e.target.value)} />
                  <Button disabled={newCollectionSaving} onClick={addCollection} color="neutral">
                    {newCollectionSaving ? <CircularProgress /> : "Créer collection"}
                  </Button>
                </div>
              </motion.div>

              <motion.div
                className="border border-gray-200 rounded-md py-10 px-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: .6 }}
              >
                <Typography gutterBottom level="h2" component="div" textColor="neutral.700">
                  Nouveau booster
                </Typography>
                <div className="grid grid-cols-[6fr_1fr] gap-5">
                  <Autocomplete
                    placeholder="Nom de la collection"
                    options={collectionsLoading ? [] : collections}
                    onChange={(_, value: any) => setNewBoosterCollection(value)}
                  />
                  <Button disabled={newBoosterSaving} onClick={addBooster} color="neutral">
                    {newBoosterSaving ? <CircularProgress /> : "Créer booster"}
                  </Button>
                </div>
              </motion.div>
            </div>
        }
      </Card>
    </Container>
  )
}
