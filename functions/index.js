const { onRequest } = require("firebase-functions/v2/https");

exports.server = onRequest((req, res) => {
  res.send("Firebase Functions OK");
});