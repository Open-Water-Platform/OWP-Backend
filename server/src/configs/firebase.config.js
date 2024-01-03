const admin = require("firebase-admin");

const { getFirestore } = require("firebase-admin/firestore");
var serviceAccount = require("./service-account.js");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports.auth = admin.auth;
module.exports.firestoredb = getFirestore;
