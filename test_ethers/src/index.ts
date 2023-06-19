import { createConstellation, numberOf } from './factory';
import { 
  Wallet,
  JsonRpcProvider
 } from 'ethers';

async function  main() {
  const provider = new JsonRpcProvider(
    "https://testnet.sapphire.oasis.dev",
    {name: "Sapphire Testnet", chainId: 23295},
    )
  const wallet = new Wallet("0x64f6225079a4d12e11aba350b43643e64972bd90eb2f1e58379a563bbd58770a", provider)
  const constellation = await createConstellation (
    wallet,
    "Test token",
    "TST",
    [100, 250],
    false,
    true
  );

  console.log("createConstellation: ", constellation);
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
  