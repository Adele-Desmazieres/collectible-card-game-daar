import { useEffect, useMemo, useRef, useState } from 'react'
import * as ethereum from '@/lib/ethereum'
import * as main from '@/lib/main'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProfileView from './components/ProfileView'
import { Booster } from './components/Booster'
import AdminView from './components/AdminView'
import UserView from './components/UserView';
import NotFoundPage from './components/NotFoundPage';
import TabBar from './components/TabBar';

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

  return (
    <BrowserRouter>
      <TabBar />
      <Routes>
        <Route path="/" element={<ProfileView wallet={wallet} />} />
        <Route path="/admin" element={<AdminView wallet={wallet} />} />
        <Route path="/user/:id" element={<UserView wallet={wallet} />} />
        <Route path="/booster" element={<Booster wallet={wallet} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
