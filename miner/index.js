import 'dotenv/config';
import {getIP} from './accessors/ip.js';
import { getTransactionDetails } from './accessors/aptos.js';
import { getVPNObjId } from './helper/aptos.js';
import { provideAccess } from './component/provideAccess.js';
import { initBoot } from './helper/boot.js';
import { updateIPAddressIfRequired } from './helper/ipUpdate.js';
import { addVPNClient, checkExpiredVPNConfig } from './helper/wireguardConfig.js';
//tx for vpnprovider creation 0xec4a70e2883c95d3339a0a509c5d9ca1cc61084ec311d221d1e75864708101d1
//provideAccess("0xaa4889db72049a54e31c65df276e717a8961e3b1486f917e15a60f01ecd87278");
await checkExpiredVPNConfig();
