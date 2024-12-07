const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountkey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
