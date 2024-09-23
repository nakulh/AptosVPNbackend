import {getAllVPNProviders} from '../accessors/ddbAccessor.js';
import {getConnectionString} from '../accessors/minerAccessor.js';
import {broadcastMinerHealth} from '../accessors/validatorAccessor.js';
import {deleteVpnProvider} from '../accessors/aptosAccessor.js';

// ToDo: Add consensus mechanism similar to byzantine fault tolerance.
// Right now this is very basic, if there is even 1 evil governance node, the entire network will be compromised as 
// gov nodes can delete VPN provider entry.
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

export const deleteVpnProviderIfApplicable = async () => {
    const vpnProviders = (await getAllVPNProviders()).Items;
    const faultyProviders = vpnProviders.filter(provider => provider.faultCount > 3); // if fault count > 3, delete the provider, this will completely stop its future connections
    for (const faultyProvider of faultyProviders) {
        await deleteVpnProvider(faultyProvider.address);
    }
}

setInterval(checkRandomVpnProvider, 600000); // Check health every minute
setInterval(deleteVpnProviderIfApplicable, 600000); // Delete misbehaving providers