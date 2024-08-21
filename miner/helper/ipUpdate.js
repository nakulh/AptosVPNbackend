import { getIP } from '../accessors/ip.js';
import { getVPNConfiguration, getWalletPrivateKey, saveVPNConfiguration } from '../accessors/db.js';
import { updateVPNProvider } from '../accessors/aptos.js';

export const updateIPAddressIfRequired = async () => {
    const currentIPAddress = await getIP() + process.env.DEFAULT_WIREGUARD_PORT;
    const vpnConfig = getVPNConfiguration();
    const storedIPAddress = vpnConfig.address;
    if (currentIPAddress !== storedIPAddress) {
        console.log(`IPv4 address has changed from ${storedIPAddress} to ${currentIPAddress}`);
        const privateKey = getWalletPrivateKey();
        try {
            await updateVPNProvider(privateKey, vpnConfig.vpnObj, currentIPAddress);
            saveVPNConfiguration(vpnConfig.vpnObj, currentIPAddress);
        } catch (err) {
            console.error('Failed to update VPN provider:', err);
        }
    }
}