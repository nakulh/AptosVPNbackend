import { getVPNClients, getWalletPrivateKey } from '../accessors/db.js';
import { getClientRawConfig, addVPNClient } from '../helper/wireguardConfig.js'
import { getTransactionDetails, getAddressFromPrivateKey } from '../accessors/aptos.js'
import { verifySignature } from '../helper/signature.js';

const PURCHASE_FUNCTION_NAME = `${process.env.PACKAGE_ADDRESS}::vpn_manager::purchase`;
const DEPOSIT_EVENT = "0x1::coin::DepositEvent";
export async function provideAccess(txHash, signature) {
    const transaction = await getTransactionDetails(txHash);
    const accountAddress = getAddressFromPrivateKey(getWalletPrivateKey()); 
    console.log("Got transaction details for " + txHash);
    const publicKey = transaction.signature?.public_key;
    if (transaction.payload.function !== PURCHASE_FUNCTION_NAME) {
        throw new Error("No valid transaction found");
    }
    if (!await verifySignature(signature, publicKey, txHash)) {
        throw new Error("Invalid Signature");
    }
    for (const event of transaction.events) {
        if (event.type === DEPOSIT_EVENT && event.guid.account_address === accountAddress) {
            console.log("correct transaction");
            return await addNewClient(txHash);
        }
    }
    throw new Error("No valid transaction found");
}

async function addNewClient(clientId) {
    clientId = clientId.substring(clientId.length - 15); // ToDo: use complression instead of taking last 15 chars
    const currentClient = getVPNClients();
    if (currentClient[clientId] == undefined) {
        await addVPNClient(clientId);
    }
    return getClientRawConfig(clientId);
}