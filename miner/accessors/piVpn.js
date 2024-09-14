// create new wireguard config per device
// delete old configs after time passes
import { exec } from 'child_process';
export function createClientConfig(clientId) {
    return new Promise((resolve, reject) => {
        exec(`pivpn add -n ${clientId}`, (error, stdout, stderr) => {
            if(error) {
                console.log(error);
                reject(error);
            };
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                reject(new Error(stderr));
                return;
            }
            console.log(`stdout: ${stdout}`);
            resolve(clientId);
        });
    });
    
}

export function deleteClientConfig(clientId) {
    return new Promise((resolve, reject) => {
        exec(`pivpn remove ${clientId} -y`, (error, stdout, stderr) => {
            if(error) {
                console.log(error);
                reject(error);
            };
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                reject(new Error(stderr));
                return;
            }
            console.log(`stdout: ${stdout}`);
            resolve(clientId);
        });
    });
}

export function getPiVpnVersion() {
    return new Promise((resolve, reject) => {
        exec('pivpn -v', (error, stdout, stderr) => {
            if(error) {
                console.log(error);
                console.log("Relax above error is EXPECTED");
                reject(error);
            };
            if (stderr) {
                reject(new Error(stderr));
                return;
            }
            //console.log(`stdout: ${stdout}`);
            resolve(stdout.trim());
        });
    });
}

export function installPiVpn() {
    return new Promise((resolve, reject) => {
        exec('chmod +x ./accessors/piVPNInstall.sh', (error, stdout, stderr) => {
            if(error) {
                console.log(error);
                reject(error);
            };
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                reject(new Error(stderr));
                return;
            }
            console.log(`stdout: ${stdout}`);
            exec('./accessors/piVPNInstall.sh --unattended ./accessors/piVPNWireguard.conf', (error, stdout, stderr) => {
                if(error) {
                    console.log(error);
                    reject(error);
                };
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    reject(new Error(stderr));
                    return;
                }
                console.log(`stdout: ${stdout}`);
                resolve(stdout);
            });
        });
    });
}