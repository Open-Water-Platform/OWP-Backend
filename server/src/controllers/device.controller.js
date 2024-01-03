const {
  fetchById,
} = require("../models/data.model");

const {
  getAllDevices,
  getUserDevices,
} = require("../utils/utils");

const mainDB = 'OWMP';

async function getDeviceData(req, res) {
  try {
    let { id } = req.params;

    let response = await fetchById(Number(id), 100, mainDB);

    res.status(200).send({ message: "data fetched successfully", data: response });
    
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e });
  }
}

async function handleGetUserDevices(req, res) {
  try {
    let { type } = req.query;
    let { uid } = req.userRecord;
    let admin = req.userRecord?.customClaims?.admin;
    let devices = [];
    if (admin) {
      devices = await getAllDevices(type);
    } else {
      devices = await getUserDevices(uid, type);
    }

    res.status(200).send({ data: { user_devices: devices } });
  } catch (err) {
    res.status(404).send({ message: "not found" });
    console.log(err);
  }
}


module.exports = {
  getDeviceData,
  handleGetUserDevices,
};
