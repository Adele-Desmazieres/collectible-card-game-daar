import { Card, CardContent, CircularProgress, Container, Divider, Select, Option } from "@mui/joy";
import { Button, LinearProgress, TextField, Typography } from "@mui/material";
import { Wallet } from "../App";
import { useEffect, useState } from "react";
import * as ethereum from '@/lib/ethereum'

export default function AdminView({ wallet }: { wallet: Wallet }) {
  const [newCardUri, setNewCardUri] = useState("")
  const [newCardCollection, setNewCardCollection] = useState("")
  const [newCardSaving, setNewCardSaving] = useState(false)

  const [newCollection, setNewCollection] = useState("")
  const [newCollectionSaving, setNewCollectionSaving] = useState(false)

  const [isAdmin, setIsAdmin] = useState(false)
  const [isAdminReq, setIsAdminReq] = useState(true)

  const [collections, setCollections] = useState<string[]>([])
  const [collectionsLoading, setCollectionsLoading] = useState(true)

  function adminCheck() {
    setIsAdminReq(true)
    wallet?.contract.isAdmin()
      .then((res: boolean) => setIsAdmin(res))
      .finally(() => setIsAdminReq(false))
  }
  function updateCollections() {
    setCollectionsLoading(true)
    wallet?.contract.getCollections()
      .then((cols: any) => {
        console.log(cols)
        setCollections(cols)
      })
      .finally(() => setCollectionsLoading(false))
  }

  ethereum.accountsChanged(adminCheck)
  useEffect(() => wallet && adminCheck(), [wallet])
  useEffect(() => wallet ? updateCollections() : console.log("wallet is", wallet), [wallet])

  function addCard() {
    const adr = wallet?.details.signer?.getAddress()
    setNewCardSaving(true)
    console.log("newCardCollection", newCardCollection);
    console.log("newCardUri", newCardUri);
    wallet?.contract.mintCard(adr, newCardCollection, newCardUri).finally(() => setNewCardSaving(false))
  }

  function addCollection() {
    setNewCollectionSaving(true)
    wallet?.contract.createCollection(newCollection).finally(() => setNewCollectionSaving(false))
  }

  return (
    <Container className="mt-20">
      <Card className="flex justify-center items-center min-h-28" >
        {isAdminReq ? <CircularProgress /> :
          !isAdmin ? <h1 className="m-auto">Not an admin</h1> :
            <div className="my-10">
              {/* # nouvelle Carte # nouvelle collections # nouvelle type de booster? # les collections déjà existants(autocomplete pour nouvelle Carte?) */}
              <Card className="flex flex-col gap-2">
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Nouvelle carte
                  </Typography>
                  <div className="grid grid-cols-[2fr_5fr_1fr] gap-5">
                    <Select placeholder="Collection" variant="outlined" onChange={(e: any) => {
                      setNewCardCollection(e.target.textContent)
                    }}>
                      {collectionsLoading ? <LinearProgress /> :
                        collections.length === 0 ? <h1 className="px-5">Wow le vide</h1> :
                          collections.map(c => <Option key={c} value={c}>{c}</Option>)
                      }
                    </Select>
                    <TextField placeholder="URL" variant="outlined" onChange={(e) => setNewCardUri(e.target.value)} />
                    <Button variant="contained" disabled={newCardSaving} onClick={addCard}>
                      {newCardSaving ? <CircularProgress /> : "Créer"}
                    </Button>
                  </div>

                  <div className="my-10" >
                    <Divider />
                  </div>

                  <Typography gutterBottom variant="h5" component="div">
                    Nouvelle collection
                  </Typography>
                  <div className="grid grid-cols-[7fr_1fr] gap-5">
                    <TextField placeholder="Collection" variant="outlined" onChange={(e) => setNewCollection(e.target.value)} />
                    <Button variant="contained" disabled={newCollectionSaving} onClick={addCollection}>
                      {newCollectionSaving ? <CircularProgress /> : "Créer"}
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
