import { JSONFileSyncPreset } from 'lowdb/node';
import * as dayjs from 'dayjs';

const db = JSONFileSyncPreset('db.json', { walletKey: "", VPNConfiguration: { vpnObj: "", address: "" }, wireguardConfigPath: "", vpnClients: {}});

export const saveWalletPrivateKey = (key) => {
    db.data.walletKey = key;
    db.write();
};

export const getWalletPrivateKey = () => {
    const { walletKey } = db.data;
    return walletKey;
};

export const saveVPNConfiguration = (vpnObj, address) => {
    db.data.VPNConfiguration.vpnObj = vpnObj;
    db.data.VPNConfiguration.address = address;
    db.write();
}

export const getVPNConfiguration = () => {
    const { VPNConfiguration } = db.data;
    return VPNConfiguration;
}

export const saveWireguardConfigPath = (path) => {
    db.data.wireguardConfigPath = path;
    db.write();
}

export const getWireguardConfigPath = () => {
    const { wireguardConfigPath } = db.data;
    return wireguardConfigPath;
}

export const addVPNClient = (id) => {
    db.data.vpnClients[id] = {endTime: dayjs().add(1, 'day').format()};
    db.write();
}

export const getVPNClients = () => {
    const { vpnClients } = db.data;
    return vpnClients;
}
