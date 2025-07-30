import { firestoredb } from '../configs/firebase.config';
import { Device } from '../types';

const getUserDevices = (userId: string, type: string): Promise<Device[]> => {
  return new Promise((resolve, reject) => {
    firestoredb()
      .collection('devices')
      .where('device_enabled', '==', true)
      .where('type', '==', type)
      .where('userId', 'array-contains', userId)
      .get()
      .then((data) => {
        if (data.empty) {
          reject('not user');
        } else {
          const devices: Device[] = [];
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
        reject(err);
      });
  });
};

const getAllDevices = (type: string): Promise<Device[]> => {
  return new Promise((resolve, reject) => {
    firestoredb()
      .collection('devices')
      .where('device_enabled', '==', true)
      .where('type', '==', type)
      .get()
      .then((data) => {
        if (data.empty) {
          reject('');
        } else {
          const devices: Device[] = [];
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
        reject(err);
      });
  });
};

export { getAllDevices, getUserDevices }; 