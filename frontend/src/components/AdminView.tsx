import { Card, CardContent, CircularProgress, Container } from "@mui/joy";
import { Button, TextField, Typography } from "@mui/material";
import { Wallet } from "../App";
import { useEffect, useState } from "react";

export default function AdminView({ wallet }: { wallet: Wallet }) {
  const [newCardUri, setNewCardUri] = useState("")
  const [newCardCollection, setNewCardCollection] = useState("")
  const [newCardSaving, setNewCardSaving] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isAdminReq, setIsAdminReq] = useState(true)

  useEffect(() => {
    console.log("effect");

    console.log(wallet?.details.signer?.getAddress())

    if (wallet) {
      wallet.contract.isAdmin().then((res: boolean) => {
        console.log(res);
        setIsAdminReq(false)
        setIsAdmin(res)
      })
    } else {
      console.log("wallet is", wallet);
    }
  }, [wallet])

  function addCard() {
    const adr = wallet?.details.signer?.getAddress()
    setNewCardSaving(true)
    wallet?.contract.mintCard(adr, newCardCollection, newCardUri).finally(() => setNewCardSaving(false))
  }

  return (
    <Container className="mt-20">
      <Card className="flex justify-center items-center min-h-28" >
        {isAdminReq ? <CircularProgress /> :
          !isAdmin ? <h1 className="m-auto">Not an admin</h1> :
            <div>
              {/* # nouvelle Carte # nouvelle collections # nouvelle type de booster? # les collections déjà existants(autocomplete pour nouvelle Carte?) */}
              <Card className="flex flex-col gap-2">
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Nouvelle Carte
                  </Typography>
                  <div className="grid grid-cols-[2fr_5fr_1fr] gap-5">
                    <TextField placeholder="Collection" variant="outlined" onChange={(e) => setNewCardCollection(e.target.value)} />
                    <TextField placeholder="URL" variant="outlined" onChange={(e) => setNewCardUri(e.target.value)} />
                    <Button variant="contained" disabled={newCardSaving} onClick={addCard}>
                      {newCardSaving ? <CircularProgress /> : "Créer"}
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
