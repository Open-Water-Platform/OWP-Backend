import { createRegular } from "../models/data.model";
import { 
  Data, 
  ProcessedData,
  MqttClient 
} from "../types";

const owpDB: string = process.env.OWP_DB || 'owmp';

function displayData(data: Data): void {
  const deviceIdentifier = data.deviceId || data.deviceid;
  console.log(
    "\nData received from Device:" +
    deviceIdentifier +
    " @ " +
    new Date().toLocaleDateString("en-US", {
      timeZone: "Asia/Kolkata",
    }) +
    " " +
    new Date().toLocaleTimeString("en-US", {
      timeZone: "Asia/Kolkata",
    })
  );
  console.log("\n", data);
}

async function handleHardwareUpdate(topic: string, message: string, client: MqttClient, expressWs: any): Promise<void> {
  try {
    const data: Data = JSON.parse(message);
    displayData(data);

    data.timestamp = new Date().getTime();

    // Process the data for regular devices
    await handleRegularDevice(data, client);

  } catch (err) {
    console.log(err);
  }
}

async function handleRegularDevice(data: Data, client: MqttClient): Promise<void> {
  try {
    const deviceId = Number(data.deviceid);
    const timestamp = data.timestamp || new Date().getTime();

    // Calculate TDS from conductivity if available
    let tds = data.tds || 0;
    if (data.conductivity) {
      tds = data.conductivity * 0.5; // Simple conversion
    }

    // Extract chlorine, TDS, and TSS from the data
    const processedData: ProcessedData = {
      deviceid: deviceId,
      timestamp: timestamp,
      chlorine: data.chlorine || 0,
      tds: tds,
      tss: data.tss || 0,
      temperature: data.temperature || 0
    };

    // Send response to device
    client.publish(
      "devices/get/" + deviceId,
      JSON.stringify({
        extent: 3,
        interval: 30000,
        minterval: 5000,
        mode: 0,
        cmd: 0
      }),
      {
        qos: 1,
      }
    );

    console.log("\n Final processed data:");
    console.log(processedData);

    // Store data in database
    if (owpDB) {
      createRegular(processedData, owpDB)
        .then((response) => {
          console.log("Data stored on database");
        })
        .catch((err) => {
          console.log(err);
          console.log({
            error: err.errno,
            message: "Failed to store data on database",
            detail: "database service error",
          });
        });
    }
  } catch (err) {
    console.log(err);
  }
}

async function handleHardwareMeta(topic: string, message: string, client: MqttClient, expressWs: any): Promise<void> {
  try {
    const data: Data = JSON.parse(message);
    console.log(
      "\nMeta message received from Device:" +
      data.deviceId +
      " @ " +
      new Date().toLocaleDateString("en-US", {
        timeZone: "Asia/Kolkata",
      }) +
      " " +
      new Date().toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
      })
    );
    console.log("\n", data);
    console.log("Sending response to device " + data.deviceId);
    client.publish(
      "devices/meta/response/" + data.deviceId,
      JSON.stringify({
        extent: 6,
        interval: 30000,
        minterval: 5000,
        mode: 0,
        cmd: 0
      }),
      {
        qos: 1,
      }
    );
  } catch (e) {
    console.log(e);
  }
}

export { 
  handleHardwareMeta, 
  handleHardwareUpdate
}; 