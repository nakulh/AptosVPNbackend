
export const broadcastMinerHealth = async function(validatorList, faultCount, minerObjectId) {
    validatorList.forEach(async validatorAddress => {
        const response = await fetch(`${validatorAddress}/updateMinerHealth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                minerObjectId,
                faultCount
            })
        })
    });
    
}