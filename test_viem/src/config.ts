import { sapphire_testnet } from '../chains/sapphire_testnet';
import { 
  createWalletClient,
  http,
  createPublicClient
 } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'


const publicClient = createPublicClient({
  chain: sapphire_testnet,
  transport: http()
})

const walletClient = createWalletClient({
  transport: http(),
  chain: sapphire_testnet
})

const account = privateKeyToAccount('0x64f6225079a4d12e11aba350b43643e64972bd90eb2f1e58379a563bbd58770a')


export const clients = {
  public: publicClient,
  wallet: walletClient,
  account: account
}
