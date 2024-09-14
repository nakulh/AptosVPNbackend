import { getVPNClients, addVPNClient as addVPNClientInDB } from '../accessors/db.js';
import { createClientConfig, deleteClientConfig, getPiVpnVersion} from '../accessors/piVpn.js';
import dayjs from 'dayjs';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
export async function checkExpiredVPNConfig() {
    const vpnClients = getVPNClients();
    for (const clientId in vpnClients) {
        if (vpnClients.hasOwnProperty(clientId)) {
            const client = vpnClients[clientId];
            console.log(`Client ID: ${clientId}`);
            console.log(`Client data:`, client);
            if(isConfigExpired(client.endTime)) {
                await deleteVpnClient(clientId);
            } else {
                console.log('VPN configuration is still valid');
            }
        }
    }
}

export async function addVPNClient(clientId) {
    await createClientConfig(clientId);
    addVPNClientInDB(clientId);
}

export function getClientRawConfig(clientId) {
    const homeDir = os.homedir();
    const filePath = path.join(homeDir, `${process.env.WIREGUARD_CONFIG_PATH}/${clientId}.conf`);
    const fileData = fs.readFileSync(filePath);
    return fileData.toString();
}

function isConfigExpired(expiryDate) {
    const currentTime = dayjs();
    return currentTime.isAfter(expiryDate);
}

async function deleteVpnClient(clientId) {
    await deleteClientConfig(clientId);
}

export async function isWireGuardInstalled() {
    try {
        await getPiVpnVersion();
        return true;
    } catch (err) {
        console.log("pivpn not installed");
        return false;
    }
}