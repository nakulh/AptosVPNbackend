import fetch from 'node-fetch';

export async function getIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json', {
            method: "GET"
        });
        const data = await response.json();
        return data.ip;
    } catch (error) {
        throw new Error('Error fetching IP: ' + error);
    }
}