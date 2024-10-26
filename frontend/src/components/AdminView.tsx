import { Card, CardContent, CircularProgress, Container, Divider, Typography, Button, Input, Snackbar, Autocomplete } from "@mui/joy";
import { Wallet } from "../App";
import { useEffect, useState } from "react";
import * as ethereum from '@/lib/ethereum'
import { ethers } from "ethers";
import { getCardsBySet } from "@/pokemon/api";
import { motion } from 'framer-motion'

export default function AdminView({ wallet }: { wallet: Wallet }) {
  const [newCardId, setNewCardId] = useState("")
  const [newCardCollection, setNewCardCollection] = useState("")
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
      .then((cols: any) => setCollections(cols))
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
    const adr = wallet?.details.signer?.getAddress()
    setNewCardSaving(true)
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
    console.log("getRandomElements", arr, count);
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

  async function addBooster() {
    setNewBoosterSaving(true)
    const cards = await getCardsBySet(newBoosterCollection)
    const randomCards = getRandomElements(cards, 8)
    const adr = await wallet?.details.signer?.getAddress()
    wallet?.contract.giveNewBooster(adr, newBoosterCollection, randomCards.map(card => card.id))
      .then((tx: ethers.providers.TransactionResponse) => {
        notifyTransaction(tx)
        setNewBoosterSaving(false)
      })
      .catch((e: any) => {
        console.log(e)
        setNewBoosterSaving(false)
      })
  }

  return (
    <Container className="mt-20">
      <Card className="flex justify-center items-center min-h-28" >
        <div className="w-full pl-10 pt-10">
          <Typography gutterBottom level="h1" component="div">
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
            <motion.div className="my-10 flex flex-col gap-5">
              <Card>
                <CardContent>
                  <Typography gutterBottom level="h2" component="div">
                    Nouvelle carte
                  </Typography>
                  <div className="grid grid-cols-[3fr_1fr_2fr_1fr] gap-5">
                    <Input placeholder="ID de la carte Pokémon TCG" variant="outlined" onChange={(e) => setNewCardId(e.target.value)} />
                    <Input placeholder="Nb de carte" variant="outlined" onChange={(e) => setNewCardId(e.target.value)} />
                    <Autocomplete placeholder="Collection" options={collectionsLoading ? [] : collections}
                      onInputChange={(_, newInputValue) => {
                        setNewCardCollection(newInputValue);
                      }} />
                    <Button disabled={newCardSaving} onClick={addCard}>
                      {newCardSaving ? <CircularProgress /> : "Créer carte"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Typography gutterBottom level="h2" component="div">
                    Nouvelle collection
                  </Typography>
                  <div className="grid grid-cols-[6fr_1fr] gap-5">
                    <Input placeholder="Nom de la collection" variant="outlined" onChange={(e) => setNewCollection(e.target.value)} />
                    <Button disabled={newCollectionSaving} onClick={addCollection}>
                      {newCollectionSaving ? <CircularProgress /> : "Créer collection"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography gutterBottom level="h2" component="div">
                    Nouveau booster
                  </Typography>
                  <div className="grid grid-cols-[6fr_1fr] gap-5">
                    <Autocomplete
                      placeholder="Nom de la collection"
                      options={collectionsLoading ? [] : collections}
                      onChange={(_, value: any) => setNewBoosterCollection(value)}
                    />
                    <Button disabled={newBoosterSaving} onClick={addBooster}>
                      {newBoosterSaving ? <CircularProgress /> : "Créer booster"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
        }
      </Card>
    </Container>
  )
}
