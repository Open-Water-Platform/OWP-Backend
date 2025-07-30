import { service } from '../configs/db.config';
import { DeviceData, CloudantResponse, GeneralData, ProcessedData } from '../types';

/**
 * Fetches data by device ID returns data after processing history
 * @param id device id
 * @param limit limit number of response objects
 * @param dbName database name
 * @return {Promise<DeviceData>} Promise -
 *  resolve(): result object containing result of device data.
 *  reject():  Error object from the underlying data store.
 */

function getFormattedDate(timestampMilliseconds: number): string {
  const dateObject = new Date(timestampMilliseconds);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return dateObject.toLocaleDateString(undefined, options);
}

function getFormattedTime(timestampMilliseconds: number): string {
  const dateObject = new Date(timestampMilliseconds);
  return dateObject.toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit' });
}

function fetchById(id: number, limit: number, dbName: string): Promise<DeviceData> {
  return new Promise((resolve, reject) => {
    const selector = {
      deviceId: `${id}`,
      timestamp: { $gt: 0 }
    };

    service.postFind({
      db: dbName,
      selector: selector,
      sort: [{ timestamp: 'desc' }],
      limit: limit
    }).then((response: CloudantResponse) => {
      if (response.result.docs.length > 0) {
        const docData = response.result.docs;

        const newData: DeviceData[] = docData.map((d: any) => {
          const salinity = Number(((d.tds / 0.722 / 1000) * 1.09 * 0.47).toFixed(2));
          const ec = Number((d.tds / 0.5).toFixed(2));
          const resistivity = Number((1 / (d.tds / 0.722)).toFixed(4));
          const date = getFormattedDate(d.timestamp);
          const time = getFormattedTime(d.timestamp);
          const updatedSummary = d.summary.Purification[0];

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
        const data: DeviceData = { ...latest, history: history };
        resolve(data);
        console.log(data);
      } else {
        reject(new Error('No documents found'));
      }
    }).catch((err: Error) => {
      reject(err);
    });
  });
}

/**
 * Creates a regular device reading in the database
 * @param data - Device data to store
 * @param dbName - Database name
 * @returns Promise that resolves when data is stored
 */
function createRegular(data: ProcessedData, dbName: string): Promise<any> {
  return new Promise((resolve, reject) => {
    service.postDocument({
      db: dbName,
      document: data
    }).then((response) => {
      resolve(response);
    }).catch((err) => {
      reject(err);
    });
  });
}

export { fetchById, createRegular }; 