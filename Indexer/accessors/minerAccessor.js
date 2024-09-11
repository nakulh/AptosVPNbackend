 export const getConnectionString = async function(address) {
    // ToDo: This should also send a signature to prove its a governance node
    const response = await fetch(`${address}/getConnectionForAuditing`, {
        method: "GET"
    });
    const data = await response.json();
    return data.connectionString;
 }