import { Account, Aptos, AptosConfig, Network, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";

const config = new AptosConfig({ network: process.env.APTOS_ENVIRONEMNT });
const aptos = new Aptos(config);
const account = getAccountFromPrivateKey(process.env.PRIVATE_KEY);

export async function deleteVPNProvider(vpnObj) {
    const payload = {
        function: `${process.env.PACKAGE_ADDRESS}::vpn_manager::delete`,
        functionArguments: [vpnObj]
    };
    const transHash = await processTransaction(payload);
    return transHash;
}

async function processTransaction(payload) {
    console.log("payload for transaction " + JSON.stringify(payload));
    const rawTxn = await aptos.transaction.build.simple({
        sender: account.accountAddress,
        data: payload
    });

    const pendingTxn = await aptos.transaction.signAndSubmitTransaction({ signer: account, transaction: rawTxn });

    // Wait for transaction
    await aptos.transaction.waitForTransaction({ transactionHash: pendingTxn.hash });

    console.log("Transaction successful:", pendingTxn.hash);
    return pendingTxn.hash;
}