import { useEffect, useMemo, useRef, useState } from 'react'
import * as ethereum from '@/lib/ethereum'
import * as main from '@/lib/main'
import { PokemonCard } from './components/PokemonCard'
import { getCardById } from './server'
import './index.css'
import { space } from 'postcss/lib/list'

type Canceler = () => void
const useAffect = (
  asyncEffect: () => Promise<Canceler | void>,
  dependencies: any[] = []
) => {
  const cancelerRef = useRef<Canceler | void>()
  useEffect(() => {
    asyncEffect()
      .then(canceler => (cancelerRef.current = canceler))
      .catch(error => console.warn('Uncatched error', error))
    return () => {
      if (cancelerRef.current) {
        cancelerRef.current()
        cancelerRef.current = undefined
      }
    }
  }, dependencies)
}

const useWallet = () => {
  const [details, setDetails] = useState<ethereum.Details>()
  const [contract, setContract] = useState<main.Main>()
  useAffect(async () => {
    const details_ = await ethereum.connect('metamask')
    if (!details_) return
    setDetails(details_)
    const contract_ = await main.init(details_)
    if (!contract_) return
    setContract(contract_)
  }, [])
  return useMemo(() => {
    if (!details || !contract) return
    return { details, contract }
  }, [details, contract])
}


const addCollection = (wallet:any) => {
  wallet?.contract.createCollection("Wild Forest")
}



const createCard = (wallet:any) => {
  wallet?.contract.mintCard("bonjour", "monde").then((res:any) => console.log(res))
}


export const App = () => {
  const wallet = useWallet()
  const [balance, setBalance] = useState<number>(0)
  
  const countCollections = (wallet:any) => {
    wallet?.contract.getNumberCollections().then((res:any) => 
      setBalance(res)
    )
  }
  
  
  return (
    <div>
      <h1>Welcome to Pokémon TCG</h1>
      <br/>
      <button id='btn-models' value="Get Models" onClick={() => addCollection(wallet)}>Add collection</button>
      <br/>
      <br/>
      <button id='btn-models' value="Get Models" onClick={() => countCollections(wallet)}>Get nb collections</button>
      <p>Nb of Collections : {balance}</p>
      
    </div>
  )
}
