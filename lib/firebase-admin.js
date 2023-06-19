const admin = require("firebase-admin");
const config = require("../firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(config),
});

module.exports = admin;
