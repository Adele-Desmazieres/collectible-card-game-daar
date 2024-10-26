import { Wallet } from '../App'
import { UserViewBasic } from './UserView'

export default function ProfileView({ wallet }: { wallet: Wallet }) {
  // @ts-ignore
  return <UserViewBasic wallet={wallet} userId={wallet?.details.account} />
}
