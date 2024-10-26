import 'dotenv/config'
import { DeployFunction } from 'hardhat-deploy/types'
import type { Main } from '$/Main'
import { Set } from '../lib/pokemon/set'
import { Card } from '../lib/pokemon/card'

const API_URL = "http://localhost:3000"

type ApiRes<T> = { data: T[] }

async function apiCall<T>(suffix: string): Promise<ApiRes<T>> {
  let res = await fetch(`${API_URL}/${suffix}`)
  return await res.json()
}

async function setUp(mainContract: Main, admin: string) {
  const setsRes: ApiRes<Set> = await apiCall('sets/all')
  const sets = setsRes.data.slice(0, 5)
  Promise.all(sets.map(async set => {
    mainContract.createCollection(set.name)
    const cardsRes: ApiRes<Card> = await apiCall(`cards/by-set/${set.id}`)
    const cards = cardsRes.data.splice(0, 5)
    for (const card of cards) {
      mainContract.giveNewCard(admin, set.name, card.id)
    }
  }))
}

const deployer: DeployFunction = async hre => {
  if (hre.network.config.chainId !== 31337) return
  const { deployments, getNamedAccounts, ethers } = hre
  const { deployer } = await getNamedAccounts()
  const mainDeployement = await deployments.deploy('Main', { from: deployer, log: true })
  const main = await ethers.getContractAt('Main', mainDeployement.address)
  setUp(main as any as Main, deployer)
}

export default deployer
