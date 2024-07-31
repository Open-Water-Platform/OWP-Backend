const {
  getDeviceData,
  handleGetUserDevices,
} = require("../controllers/device.controller");
const { getAllDevices} = require("../utils/utils");
const router = require("express").Router();


router.get("/all/", async (req, res) => {
  try {
    const devices = await getAllDevices("sw");
    console.log(devices);
    res.status(200).send({ data: { user_devices: devices } });
  } catch (err) {
    res.status(404).send({ message: err });
    console.log(err);
  }
});


router.get("/", handleGetUserDevices);
router.get("/all/:id", getDeviceData);

module.exports.deviceRoute = router;
