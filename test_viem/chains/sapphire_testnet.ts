import { Chain } from '@wagmi/chains'

export const sapphire_testnet = {
    id: 23295,
    name: "Sapphire Testnet",
    network: "sapphtest",
    nativeCurrency: { name: "TEST", symbol: "TEST", decimals: 18 },
    rpcUrls: {
      default: {
        http: ["https://testnet.sapphire.oasis.dev"]
      },
      public: {
        http: ["https://testnet.sapphire.oasis.dev"]
      }
    },
    blockExplorers: {
      default: {
        name: "Sapphire Testnet Explorer",
        url: "https://testnet.explorer.sapphire.oasis.dev/"
      }
    },
    testnet: true
  } as const satisfies Chain