require("dotenv").config();

const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGODB_CONNECT);

client
  .connect()
  .then(() => {
    console.log("Server Connected to Database");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = client.db('FriendsBook');
