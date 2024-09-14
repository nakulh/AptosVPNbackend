// veryfy ed25519 signature https://github.com/paulmillr/noble-ed25519
import * as ed from '@noble/ed25519';

export const verifySignature = async (signature, publicKey, transactionHash) => {
    const txHashUint8 = new Uint8Array(transactionHash.split('').map (function (c) { return c.charCodeAt (0); }));
    const sigUint8 = new Uint8Array(signature);
    const publicKeyUint8 = new Uint8Array(byteFromHexStr(publicKey.substring(2)));
    return await ed.verifyAsync(sigUint8, txHashUint8, publicKeyUint8);
}

const byteFromHexStr = (hexStr) => {
    var l = hexStr.length / 2;
    var arr = [];
    for (var i = 0; i < l; i++) {
        var str = hexStr.substr(i * 2, 2);
        arr.push(Math.abs(parseInt(str, 16)));
    }
    return arr;
}