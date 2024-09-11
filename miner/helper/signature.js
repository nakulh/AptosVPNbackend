// veryfy ed25519 signature https://github.com/paulmillr/noble-ed25519
import * as ed from '@noble/ed25519';

export const verifySignature = async (signature, publicKey, transactionHash) => {
    return await ed.verifyAsync(signature, transactionHash, publicKey);
}