// create new wireguard config per device
// delete old configs after time passes
import { exec } from 'child_process';
export function createClientConfig(clientId, cb) {
    exec('pivpn add -n %s' % clientId, (error, stdout, stderr) => {
        if(error) {
            console.log(error);
            throw error;
        };
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        cb(clientId);
    });
}

export function deleteClientConfig(clientId) {
    exec('pivpn remove %s -y' % clientId, (error, stdout, stderr) => {
        if(error) {
            console.log(error);
            throw error;
        };
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}