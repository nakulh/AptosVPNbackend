// create new wallet and VPNProvider
import { getWalletPrivateKey, getVPNConfiguration, saveWalletPrivateKey, saveVPNConfiguration } from '../accessors/db.js';
import { createNewWallet, createVpnProvider, fundAccountIfPossible } from '../accessors/aptos.js';
import { getIP } from '../accessors/ip.js';
import { getVPNObjId } from './aptos.js';
import { isWireGuardInstalled } from './wireguardConfig.js';
import { installPiVpn } from '../accessors/piVpn.js';
export async function initBoot() {

    if (!isWireGuardInstalled()) {
        console.log('installing vpn server, this will take a while...');
        try {
            await installPiVpn();
        } catch (err) {
            console.error("Failed to install PiVPN:", err);
            console.error("Please install PiVPN manually from https://docs.pivpn.io/install/ before proceeding");
            return;
        }
    } else {
        console.log("WireGuard server PiVPN is already installed");
    }

    let privateKey = getWalletPrivateKey();
    if (privateKey === undefined || privateKey === null || privateKey.length === 0) {
        console.log("No existing wallet found, creating new");
        privateKey = createNewWallet();
        saveWalletPrivateKey(privateKey);
    }
    await fundAccountIfPossible(privateKey);

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