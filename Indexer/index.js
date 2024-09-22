//https://api.blockeden.xyz/aptos/testnet/MqZ9ZkMoCK8affXfSuod
import util from 'util';
import 'dotenv/config';
const objConfig = {showHidden: false, depth: null, colors: true};
import { startServer } from './server.js';
import { handleAllEvents } from './helpers/eventsHelper.js';

startServer();

setInterval(async () => {
    await handleAllEvents();
}, 5 * 60 * 1000);
