import { Button } from "@mui/joy";
import { useState } from "react";
import { Wallet } from "../App";

export default function Home({ wallet }: { wallet: Wallet }) {
  const [balance, setBalance] = useState<number>(0)

  const countCollections = (wallet: Wallet) => {
    wallet?.contract.getNumberCollections().then((res: any) =>
      setBalance(res)
    )
  }

  const addCollection = (wallet: Wallet) => {
    wallet?.contract.createCollection("Wild Forest")
  }

  const createCard = (wallet: Wallet) => {
    wallet?.contract.mintCard("bonjour", "monde").then((res: any) => console.log(res))
  }

  return (
    <div>
      <h1>Welcome to Pokémon TCG</h1>
      <br />
      <Button id='btn-models' value="Get Models" onClick={() => addCollection(wallet)}>Add collection</Button>
      <br />
      <br />
      <Button onClick={() => countCollections(wallet)}>Refresh Collections</Button>
      <p>Nb of Collections : {balance}</p>
    </div>
  )
}
