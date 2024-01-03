const { firestoredb } = require("../configs/firebase.config");
const getUserDevices = (userId, type) => {
  return new Promise((resolve, reject) => {
    firestoredb()
      .collection("devices")
      .where("device_enabled", "==", true)
      .where("type", "==", type)
      .where("userId", "array-contains", userId)
      .get()
      .then((data) => {
        if (data.empty) {
          reject("not user");
        } else {
          let devices = [];
          data.docs.forEach((d) => {
            devices.push({ docId: d.id, ...d.data() });
          });
          if (devices.length === data.docs.length) {
            resolve(devices);
          }
        }
      })
      .catch((err) => {
        console.log(err);
        reject();
      });
  });
};
const getAllDevices = (type) => {
  return new Promise((resolve, reject) => {
    firestoredb()
      .collection("devices")
      .where("device_enabled", "==", true)
      .where("type", "==", type)
      .get()
      .then((data) => {
        if (data.empty) {
          reject("");
        } else {
          let devices = [];
          data.docs.forEach((d) => {
            devices.push({ docId: d.id, ...d.data() });
          });
          if (devices.length === data.docs.length) {
            resolve(devices);
          }
        }
      })
      .catch((err) => {
        console.log(err);
        reject();
      });
  });
};




module.exports.getAllDevices = getAllDevices;
module.exports.getUserDevices = getUserDevices;
