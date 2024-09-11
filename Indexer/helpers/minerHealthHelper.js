import {getAllVPNProviders} from '../accessors/ddbAccessor.js';
import {getConnectionString} from '../accessors/minerAccessor.js';
import {broadcastMinerHealth} from '../accessors/validatorAccessor.js';

export const checkAndUpdateMinerHealth = async (vpnProvider) => {
    const connectionString = await getConnectionString(vpnProvider.address);
    if (connectionString) {
        console.log(vpnProvider, " is Healthy");
    } else {
        await broadcastMinerHealth([], 1, vpnProvider.objectId); // broadcasts itself too.
    }
}

export const checkRandomVpnProvider = async () => {
    const vpnProviders = (await getAllVPNProviders()).Items;
    const randomIndex = Math.floor(Math.random() * vpnProviders.length);
    const randomVpnProvider = vpnProviders[randomIndex];
    await checkAndUpdateMinerHealth(randomVpnProvider);
}

setInterval(checkRandomVpnProvider, 60000); // Check health every minute