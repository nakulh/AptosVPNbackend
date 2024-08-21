import { Account, Aptos, AptosConfig, Network, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";
const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);

export function createNewWallet() {
    const account = Account.generate();
    return account.privateKey.toString();
}
// Helper func should have try catch
export async function createVpnProvider(walletPrivateKey, name, address, price) {
    const account = getAccountFromPrivateKey(walletPrivateKey);
    const payload = {
        function: `${process.env.PACKAGE_ADDRESS}::vpn_manager::create_vpn_provider`,
        functionArguments: [name, address, price]
    };
    return await processTransaction(account, payload);
}

export async function updateVPNProvider(walletPrivateKey, vpnObj, newAddress) {
    const account = getAccountFromPrivateKey(walletPrivateKey);
    const payload = {
        function: `${process.env.PACKAGE_ADDRESS}::vpn_manager::modifyVPNAddress`,
        functionArguments: [vpnObj, newAddress]
    };
    return await processTransaction(account, payload);
}

export async function deleteVPNProvider(walletPrivateKey, vpnObj) {
    const account = getAccountFromPrivateKey(walletPrivateKey);
    const payload = {
        function: `${process.env.PACKAGE_ADDRESS}::vpn_manager::delete`,
        functionArguments: [vpnObj]
    };
    const transHash = await processTransaction(account, payload);
    return transHash;
}

export async function getTransactionDetails(txId) {
    const res = await aptos.transaction.getTransactionByHash({transactionHash: txId});
    return res;
}

export function getAddressFromPrivateKey(walletPrivateKey) {
    try {
      const account = getAccountFromPrivateKey(walletPrivateKey);
      return account.accountAddress.toString();
    } catch (error) {
      console.error('Error getting Aptos address:', error);
      return null;
    }
  }

async function processTransaction(account, payload) {
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

function getAccountFromPrivateKey(privateKeyHex) {
    const privateKey = new Ed25519PrivateKey(privateKeyHex);
    return Account.fromPrivateKey({ privateKey });
}
