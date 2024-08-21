import { Account, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import util from 'util';
import {putNewVPNProvider, deleteVPNProvider, updateVPNProvider} from "../accessors/ddbAccessor.js";
const objConfig = {showHidden: false, depth: null, colors: true};
const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);

const createdEvent = process.env.CONTRACT + "::vpn_manager::VPNCreatedEvent";
const updatedEvent = process.env.CONTRACT + "::vpn_manager::VPNUpdatedEvent";
const deletedEvent = process.env.CONTRACT + "::vpn_manager::VPNDeletedEvent";
const vpnProviderObj = process.env.CONTRACT + "::vpn_manager::VpnProvider";

const createdEventOffset = parseInt(process.env.CREATED_OFFSET);
const updatedEventOffset = parseInt(process.env.UPDATED_OFFSET);
const deletedEventOffset = parseInt(process.env.DELETED_OFFSET);
const pageLimit = 20;

export const handleAllEvents = async () => {
    const createEvents = await aptos.getModuleEventsByEventType({ eventType: createdEvent, options: {offset: createdEventOffset, limit: pageLimit}});
    createdEventOffset += createEvents.length();
    handleCreated(createEvents);

    const updateEvents = await aptos.getModuleEventsByEventType({ eventType: updatedEvent, options: {offset: updatedEventOffset, limit: pageLimit}});
    updatedEventOffset += updateEvents.length();
    handleUpdated(updateEvents);

    const deleteEvents = await aptos.getModuleEventsByEventType({ eventType: deletedEvent, options: {offset: deletedEventOffset, limit: pageLimit}});
    deletedEventOffset += deleteEvents.length();
    handleDeleted(deleteEvents);
}

const handleCreated = async (createEvents) => {
    createEvents.forEach(async event => {
        console.log("HANDLING CREATED");
        console.log(util.inspect(event, objConfig));
        const ledgerVersion = event.transaction_version;
        const transaction = await aptos.getTransactionByVersion({ ledgerVersion });
        const objId = "";
        transaction.changes.forEach(change => {
            if (change.data.type == vpnProviderObj) {
                objId = change.address;
                return;
            }
        });
        const vpnName = event.data.name;
        const vpnPrice = event.data.price;
        const vpnSeller = event.data.seller;
        const vpnAddress = event.data.network_address;
        await putNewVPNProvider(objId, vpnName, vpnPrice, vpnAddress, vpnSeller, "india");
    });
}

const handleUpdated = async (updatedEvents) => {
    updatedEvents.forEach(async event => {
        console.log("HANDLING UPDATED");
        console.log(util.inspect(event, objConfig));
        const vpnAddress = event.data.network_address;
        const objAddress = event.data.objAddress;
        await updateVPNProvider(objAddress, vpnAddress);
    })
}

const handleDeleted = async (updatedEvents) => {
    updatedEvents.forEach(async event => {
        console.log("HANDLING DELETED");
        console.log(util.inspect(event, objConfig));
        const objAddress = event.data.objAddress;
        await deleteVPNProvider(objAddress, vpnAddress);
    })
}