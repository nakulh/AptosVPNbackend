import 'dotenv/config';
import { getIP } from './accessors/ip.js';
import { getTransactionDetails } from './accessors/aptos.js';
import { getVPNObjId } from './helper/aptos.js';
import { provideAccess } from './component/provideAccess.js';
import { initBoot } from './helper/boot.js';
import { updateIPAddressIfRequired } from './helper/ipUpdate.js';
import { addVPNClient, checkExpiredVPNConfig } from './helper/wireguardConfig.js';
import { startServer } from './server.js';

await initBoot();
startServer();

setInterval(async () => {
    await updateIPAddressIfRequired();
}, 1000 * 60 * 60);

setInterval(async () => {
    await checkExpiredVPNConfig();
}, 1000 * 60 * 10);