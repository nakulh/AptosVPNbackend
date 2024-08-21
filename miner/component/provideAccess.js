import { getVPNClients, getWalletPrivateKey } from '../accessors/db.js';
import { getClientRawConfig, addVPNClient } from '../helper/wireguardConfig.js'
import { getTransactionDetails, getAddressFromPrivateKey } from '../accessors/aptos.js'

const PURCHASE_FUNCTION_NAME = `${process.env.PACKAGE_ADDRESS}::vpn_manager::purchase`;
const DEPOSIT_EVENT = "0x1::coin::DepositEvent";
export async function provideAccess(txHash) {
    const transaction = await getTransactionDetails(txHash);
    const accountAddress = getAddressFromPrivateKey(getWalletPrivateKey()); 
    console.log(transaction);
    if (transaction.payload.function !== PURCHASE_FUNCTION_NAME) {
        throw new Error("No valid transaction found");
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
    const currentClient = getVPNClients();
    if (currentClient[clientId] == undefined) {
        addVPNClient(clientId);
    }
    return getClientRawConfig(clientId);
}