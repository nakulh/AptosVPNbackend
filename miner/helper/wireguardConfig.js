import { getVPNClients, addVPNClient as addVPNClientInDB } from '../accessors/db.js';
import { createClientConfig, deleteClientConfig} from '../accessors/piVpn.js';
import * as dayjs from 'dayjs';
import * as fs from 'fs';
export function checkExpiredVPNConfig() {
    const vpnClients = getVPNClients();
    for (const clientId in vpnClients) {
        if (vpnClients.hasOwnProperty(clientId)) {
            const client = vpnClients[clientId];
            console.log(`Client ID: ${clientId}`);
            console.log(`Client data:`, client);
            if(isConfigExpired(client.endTime)) {
                deleteVpnClient(clientId);
            }
        }
    }
}

export function addVPNClient(clientId) {
    createClientConfig(clientId, addVPNClientInDB);
}

export function getClientRawConfig(clientId) {
    const fileData = fs.readFileSync(`${process.env.WIREGUARD_CONFIG_PATH}/${clientId}.conf`);
    return fileData.toString();
}

function isConfigExpired(expiryDate) {
    const currentTime = dayjs();
    return currentTime.isAfter(expiryDate);
}

function deleteVpnClient(clientId) {
    deleteClientConfig(clientId);
}