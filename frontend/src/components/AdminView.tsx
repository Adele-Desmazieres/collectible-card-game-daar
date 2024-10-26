import { Card, CardContent, CircularProgress, Container, Divider, Typography, Button, Input, Snackbar, Autocomplete } from "@mui/joy";
import { Wallet } from "../App";
import { useEffect, useState } from "react";
import * as ethereum from '@/lib/ethereum'
import { ethers } from "ethers";

export default function AdminView({ wallet }: { wallet: Wallet }) {
  const [newCardId, setNewCardId] = useState("")
  const [newCardCollection, setNewCardCollection] = useState("")
  const [newCardSaving, setNewCardSaving] = useState(false)

  const [newCollection, setNewCollection] = useState("")
  const [newCollectionSaving, setNewCollectionSaving] = useState(false)

  const [newBoosterCol, setNewBoosterCol] = useState("")
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
      .then((cols: any) => {
        console.log("collections", cols)
        setCollections(cols)
      })
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
    console.log("newCardCollection", newCardCollection);
    console.log("newCardUri", newCardId);
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
  function addBooster() {
    setNewBoosterSaving(true)
    wallet?.contract.createCollection(newCollection)
      .then((tx: ethers.providers.TransactionResponse) => {
        notifyTransaction(tx)
        setNewBoosterSaving(false)
      })
      .catch((e: any) => {
        console.log(e)
        setNewBoosterSaving(false)
      })
  }

  function getNumberCollection() {
    wallet?.contract.getNumberCollections()
      .then((res: any) => setSnackBars([...snackBars, { msg: res, open: true }])
      )
  }
  return (
    <Container className="mt-20">
      <Card className="flex justify-center items-center min-h-28" >
        <Typography gutterBottom level="h1" component="div" className="pt-10">
          Page d'admin
        </Typography>
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
            <div className="my-10">
              {/* # nouvelle type de booster? # les collections déjà existants(autocomplete pour nouvelle Carte?) */}
              <Card className="flex flex-col gap-2">
                <CardContent>
                  <Button onClick={getNumberCollection} >get number of collections</Button>
                  <Typography gutterBottom level="h2" component="div">
                    Nouvelle carte
                  </Typography>
                  <div className="grid grid-cols-[4fr_1fr_2fr_1fr] gap-5">
                    <Input placeholder="ID de la carte Pokémon TCG" variant="outlined" onChange={(e) => setNewCardId(e.target.value)} />
                    <Input placeholder="Nb de carte" variant="outlined" onChange={(e) => setNewCardId(e.target.value)} />
                    <Autocomplete placeholder="Collection" options={collectionsLoading ? [] : collections}
                      onInputChange={(_, newInputValue) => {
                        setNewCardCollection(newInputValue);
                      }} />
                    <Button disabled={newCardSaving} onClick={addCard}>
                      {newCardSaving ? <CircularProgress /> : "Créer"}
                    </Button>
                  </div>

                  <div className="my-10" >
                    <Divider />
                  </div>

                  <Typography gutterBottom level="h2" component="div">
                    Nouvelle collection
                  </Typography>
                  <div className="grid grid-cols-[7fr_1fr] gap-5">
                    <Input placeholder="Nom de la collection" variant="outlined" onChange={(e) => setNewCollection(e.target.value)} />
                    <Button disabled={newCollectionSaving} onClick={addCollection}>
                      {newCollectionSaving ? <CircularProgress /> : "Créer collection"}
                    </Button>
                  </div>

                  <div className="my-10" >
                    <Divider />
                  </div>

                  <Typography gutterBottom level="h2" component="div">
                    Nouvelle booster
                  </Typography>
                  <div className="grid grid-cols-[7fr_1fr] gap-5">
                    <Autocomplete placeholder="Nom de la collection" options={collectionsLoading ? [] : collections} />
                    <Button disabled={newBoosterSaving} onClick={addBooster}>
                      {newBoosterSaving ? <CircularProgress /> : "Créer booster"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
        }
      </Card>
    </Container>
  )
}
