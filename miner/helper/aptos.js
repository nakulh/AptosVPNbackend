import { getTransactionDetails } from "../accessors/aptos.js";

const vpnProviderObjType = `${process.env.PACKAGE_ADDRESS}::vpn_manager::VpnProvider`;
export async function getVPNObjId(txId) {
    console.log("Getting VPNObjId for " + txId);
    const transactionDetails = await getTransactionDetails(txId);
    console.log(transactionDetails.changes);
    for (const change of transactionDetails.changes) {
        if (change.data.type === vpnProviderObjType) {
            return change.address;
        }
    }
    throw new Error("VPN provider object not found in transaction details");
}