import AWS from 'aws-sdk';
AWS.config.update({ region: "ca-central-1" });
const ddb = new AWS.DynamoDB.DocumentClient()

export const getAllVPNProviders = () => {
    const params = {
        TableName: "VpnProvider"
    };
    return ddb.scan(params).promise();
}

export const putNewVPNProvider = (objectId, name, price, address, seller, country) => {
    const putVpnProviderParams = {
        TableName: 'VpnProvider',
        Item: {
            objectId,
            name,
            price,
            address,
            seller,
            country
        }
    }
    const promise = ddb.put(putVpnProviderParams).promise();
    return promise;
}

export const deleteVPNProvider = (objectId) => {
    const deleteVpnProviderParams = {
        TableName: 'VpnProvider',
        Key: {
            objectId
        }
    }
    const promise = ddb.delete(deleteVpnProviderParams).promise();
    return promise;
}

export const updateVPNProvider = (objectId, address) => {
    const updateVpnProviderParams = {
        TableName: "VpnProvider",
        Key: {
            objectId
        },
        UpdateExpression: "set address = :address",
        ExpressionAttributeValues: {
          ":address": address,
        },
        ReturnValues: "ALL_NEW",
      };
    
      const promise = ddb.update(updateVpnProviderParams).promise();
      return promise;
}