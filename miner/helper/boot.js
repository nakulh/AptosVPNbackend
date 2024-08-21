// create new wallet and VPNProvider
import { getWalletPrivateKey, getVPNConfiguration, saveWalletPrivateKey, saveVPNConfiguration } from '../accessors/db.js';
import { createNewWallet, createVpnProvider } from '../accessors/aptos.js';
import { getIP } from '../accessors/ip.js';
import { getVPNObjId } from './aptos.js';
export async function initBoot() {
    // Check piVPN installed, install it.
    let privateKey = getWalletPrivateKey();
    if (privateKey === undefined || privateKey === null || privateKey.length === 0) {
        console.log("No existing wallet found, creating new");
        privateKey = createNewWallet();
        saveWalletPrivateKey(privateKey);
    }
    console.log("private key " + privateKey);
    let vpnConfig = getVPNConfiguration();
    if (vpnConfig.vpnObj === undefined || vpnConfig.vpnObj === null || vpnConfig.vpnObj.length === 0) {
        console.log("No existing vpn configuration, creating new, make sure account is funded");
        const ipAddress = await getIP() + process.env.DEFAULT_WIREGUARD_PORT;
        const transactionHash = await createVpnProvider(privateKey, process.env.NAME, ipAddress, 
            parseInt(process.env.PRICE_PER_DAY_IN_APTOS));
        const vpnObjId = await getVPNObjId(transactionHash);
        saveVPNConfiguration(vpnObjId, ipAddress);
    }
}