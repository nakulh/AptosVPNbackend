import {getAllVPNProviders} from '../accessors/ddbAccessor.js';
import {getConnectionString} from '../accessors/minerAccessor.js';
import {broadcastMinerHealth} from '../accessors/validatorAccessor.js';

const VALIDATOR_IP_LIST = ["https://3.96.190.37:3000"]; // right now we are the only validator, this needs to be made dynamic to introduce more validators

export const checkAndUpdateMinerHealth = async (vpnProvider) => {
    const connectionString = await getConnectionString(vpnProvider.address);
    if (connectionString) {
        console.log(vpnProvider, " is Healthy");
    } else {
        await broadcastMinerHealth(VALIDATOR_IP_LIST, 1, vpnProvider.objectId); // broadcasts itself too. Adds 1 fault count for this miner
    }
}

export const checkRandomVpnProvider = async () => {
    const vpnProviders = (await getAllVPNProviders()).Items;
    const randomIndex = Math.floor(Math.random() * vpnProviders.length);
    const randomVpnProvider = vpnProviders[randomIndex];
    await checkAndUpdateMinerHealth(randomVpnProvider);
}

setInterval(checkRandomVpnProvider, 60000); // Check health every minute