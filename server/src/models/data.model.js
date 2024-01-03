const { QueryCommand } = require("@aws-sdk/lib-dynamodb");
const { dynamoClient } = require("../configs/dynamodb.config");

/**
 * Fetches data by device ID returns data after processing history
 * @param id device id
 * @param limit limit number of response objects
 * @return {Promise} Promise -
 *  resolve(): result object containing result of device data.
 *  reject():  Error object from the underlying data store.
 */

function getFormattedDate(timestampMilliseconds) {
  const dateObject = new Date(timestampMilliseconds);

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  
  return dateObject.toLocaleDateString(undefined, options);
}

function getFormattedTime(timestampMilliseconds) {
  const dateObject = new Date(timestampMilliseconds);
  return dateObject.toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit' });
}

function fetchById(id, limit, dbname) {
  return new Promise((resolve, reject) => {
    const command = new QueryCommand({
      TableName: dbname,
      Limit: limit,

      KeyConditionExpression: "deviceId = :deviceid",
      ExpressionAttributeValues: {
        ":deviceid": id,
      },
      //   ConsistentRead: true,
      ScanIndexForward: false,
    });
    dynamoClient
      .send(command)
      .then((response) => {
        if (response.Count != 0) {
          const docData = response.Items;

          const newData = docData.map(d => {
            // Calculate new fields
            const salinity = Number(((d.tds / 0.722 / 1000) * 1.09 * 0.47).toFixed(2));
            const ec = Number((d.tds / 0.5).toFixed(2));
            const resistivity = Number((1 / (d.tds / 0.722)).toFixed(4));
            const date = getFormattedDate(d.timestamp)
            const time = getFormattedTime(d.timestamp)
            const updatedSummary = d.summary.Purification[0]

            // Return the original data with the new fields
            return {
              ...d,
              salinity,
              ec,
              resistivity,
              date,
              time,
              summary: updatedSummary
            };
          });

          const latest = newData[0];
          const history = newData;
          const data = { ...latest, history: history };
          resolve(data);
        } else {
          reject();
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports.fetchById = fetchById;

