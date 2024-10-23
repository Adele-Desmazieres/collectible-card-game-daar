import { useEffect, useMemo, useRef, useState } from 'react'
import * as ethereum from '@/lib/ethereum'
import * as main from '@/lib/main'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ProfileView from './components/ProfileView'
import { BoosterContainer } from './components/BoosterContainer'
import Home from './components/Home'
import AdminView from './components/AdminView'

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

export type Wallet = {
  details: ethereum.Details;
  contract: any;
} | undefined
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


export const App = () => {
  const wallet = useWallet()
  const router = createBrowserRouter([
    { path: "/", element: <Home wallet={wallet} /> },
    { path: "/profile", element: <ProfileView wallet={wallet} /> },
    { path: "/booster", element: <BoosterContainer /> },
    { path: "/admin", element: <AdminView wallet={wallet} /> }
  ]);

  return  <RouterProvider router={router} />
}
