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
//const sig = [166,117,76,43,24,139,43,102,197,114,153,226,209,175,129,251,229,14,108,98,164,68,131,59,211,93,176,211,117,184,91,55,159,138,41,69,73,61,91,211,49,71,72,97,156,165,235,43,139,85,26,5,173,73,232,254,111,53,149,127,156,36,27,10]
//provideAccess("0x5cd2bdd4c86418d0f29827da6d44bfc65203715709321e67f381427903435ea3", sig);
startServer();

setInterval(async () => {
    await updateIPAddressIfRequired();
}, 1000 * 60 * 60);

setInterval(async () => {
    await checkExpiredVPNConfig();
}, 1000 * 60 * 10);