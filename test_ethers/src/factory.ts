
import ISecretFactory_ABI from "../abis/ISecretFactory.json";
import {
    Contract,
    Signer,
    solidityPackedKeccak256,
    Interface
} from "ethers";

const FACTORY_ADDRESS = "0xEd98bd912f9A64fD834Ff7163DB7C7c343DDEcf8";

type Constellation = {
    dataAddress: string;
    accessesAddress: string;
    tokenAddress: string
};

function delay(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function createConstellation(
    signer: Signer,
    tokenName: string,
    tokenSymbol: string,
    scarcityLimits: number[],
    isSoultBound: boolean,
    isBurnable: boolean
// ) {
): Promise<Constellation>{
    const contract = new Contract(
        FACTORY_ADDRESS,
        ISecretFactory_ABI,
        signer
    );
    const tx = await contract.createConstellation(
        tokenName,
        tokenSymbol,
        scarcityLimits,
        isSoultBound,
        isBurnable
    )  
    const resp = await tx.wait();

    var constellationId;
    const iface = new Interface(ISecretFactory_ABI);

    const constellationAdded_sig = "ConstellationAdded(uint256)"
    const const_add_hash = solidityPackedKeccak256(["string"], [constellationAdded_sig]);
    for(let i = 0; i < resp.logs.length; i++) {
        if (resp.logs[i].topics[0] == const_add_hash) {
            constellationId = iface.decodeEventLog(
                "ConstellationAdded",
                resp.logs[i].data,
                resp.logs[i].topics
            )
        }
    }

    await delay(5000);

    if(constellationId){
        const constellation = await contract.getConstellation(constellationId[0]);
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

    } else {
        throw new Error("Error in creating constellation");
    }
}

async function numberOf(
    signer: Signer,
    creator: `0x${string}`
): Promise<number> {
    const contract = new Contract(
        FACTORY_ADDRESS,
        ISecretFactory_ABI,
        signer
    );
    const constellationId = await contract.numberOf(creator);
    return constellationId;
};

async function constellationOfCreatorByIndex(
    signer: Signer,
    creator: `0x${string}`, 
    index: number
) {
    const contract = new Contract(
        FACTORY_ADDRESS,
        ISecretFactory_ABI,
        signer
    );
    const indice = await contract.constellationOfCreatorByIndex(creator, index);
    return indice;
};


async function getConstellation(
    signer: Signer,
    identifiant: number
): Promise<Constellation> {
    const contract = new Contract(
        FACTORY_ADDRESS,
        ISecretFactory_ABI,
        signer
    );
    const constellation = await contract.getConstellation(identifiant);

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
    Constellation,
    createConstellation,
    numberOf,
    constellationOfCreatorByIndex,
    getConstellation
 }