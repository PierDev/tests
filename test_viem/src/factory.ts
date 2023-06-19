import ISecretFactory_ABI from "../abis/ISecretFactory.json";
import { 
    Account, 
    PublicClient, 
    WalletClient,
    decodeEventLog,
    encodeEventTopics,
    toHex
} from 'viem';

const FACTORY_ADDRESS = "0xEd98bd912f9A64fD834Ff7163DB7C7c343DDEcf8";

interface Constellation {
    tokenName: string;
    tokenSymbol: string;
    scarcityLimits: number[],
    isSoultBound: boolean,
    isBurnable: boolean,
    dataAddress: `0x${string}`,
    tokenAddress: `0x${string}`,
    accessesAddress: `0x${string}`
}
   

async function createConstellation(
    clients: {
        public: PublicClient,
        wallet: WalletClient,
        account: Account
    },
    tokenName: string,
    tokenSymbol: string,
    scarcityLimits: number[],
    isSoultBound: boolean,
    isBurnable: boolean
): Promise<Constellation> {
    const { request } = await clients.public.simulateContract({
        account: clients.account,
        address: FACTORY_ADDRESS,
        abi: ISecretFactory_ABI,
        functionName: 'createConstellation',
        args: [
            tokenName,
            tokenSymbol,
            scarcityLimits,
            isSoultBound,
            isBurnable
        ]
    })

    const hash = await clients.wallet.writeContract(request);
    const resp = await clients.public.waitForTransactionReceipt({
        confirmations: 2, 
        hash: hash
    })
    const event_hash = encodeEventTopics({
        abi: ISecretFactory_ABI,
        eventName: 'ConstellationAdded'
    })
    let constellationId;
    for(let i = 0; i < resp.logs.length; i++) {
        // @ts-ignore
        if (resp.logs[i].topics[0] == event_hash) {
            constellationId = decodeEventLog({
                abi: ISecretFactory_ABI,
                data: resp.logs[i].data,
                topics: resp.logs[i].topics
                // @ts-ignore
            }).args.constellationId
        }
    }
    const constellation = await clients.public.readContract({
        address: FACTORY_ADDRESS,
        abi: ISecretFactory_ABI,
        functionName: 'getConstellation',
        args: [constellationId]
    });

    return({
        // @ts-ignore
        tokenName: constellation[0],
        // @ts-ignore
        tokenSymbol: constellation[1],
        // @ts-ignore
        scarcityLimits: constellation[2],
        // @ts-ignore
        isSoultBound: constellation[3],
        // @ts-ignore
        isBurnable: constellation[4],
        // @ts-ignore
        dataAddress: constellation[5],
        // @ts-ignore
        tokenAddress: constellation[6],
        // @ts-ignore
        accessesAddress: constellation[7]
    });
}

async function numberOf(
    clients: {
        public: PublicClient,
        wallet: WalletClient,
        account: Account
    },
    creator: `0x${string}`
): Promise<number> {

    const constellationId = await clients.public.readContract({
        address: FACTORY_ADDRESS,
        abi: ISecretFactory_ABI,
        functionName: 'numberOf',
        args: [creator]
    });
    // @ts-ignore
    return constellationId;
};

async function constellationOfCreatorByIndex(
    clients: {
        public: PublicClient,
        wallet: WalletClient,
        account: Account
    },
    creator: `0x${string}`, 
    index: number
) {
    const indice = await clients.public.readContract({
        address: FACTORY_ADDRESS,
        abi: ISecretFactory_ABI,
        functionName: 'constellationOfCreatorByIndex',
        args: [
            creator,
            index
        ]
    });

    return indice;
};

async function getConstellation(
    clients: {
        public: PublicClient,
        wallet: WalletClient,
        account: Account
    },
    identifiant: number
): Promise<Constellation> {
    const constellation = await clients.public.readContract({
        address: FACTORY_ADDRESS,
        abi: ISecretFactory_ABI,
        functionName: 'getConstellation',
        args: [identifiant]
    });
    return({
        // @ts-ignore
        tokenName: constellation[0],
        // @ts-ignore
        tokenSymbol: constellation[1],
        // @ts-ignore
        scarcityLimits: constellation[2],
        // @ts-ignore
        isSoultBound: constellation[3],
        // @ts-ignore
        isBurnable: constellation[4],
        // @ts-ignore
        dataAddress: constellation[5],
        // @ts-ignore
        tokenAddress: constellation[6],
        // @ts-ignore
        accessesAddress: constellation[7]
    });
};

export { 
    createConstellation, 
    numberOf,
    getConstellation,
    constellationOfCreatorByIndex,
    Constellation 
}