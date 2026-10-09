const mongoose = require("mongoose");
require("dotenv").config();

//define mongodb conection url
const mongoURL = process.env.mongoURL;

//setup mongodb connection
mongoose.connect(mongoURL);

//get the default connection
//mongoose maintains a default connection object represting mongodb connection
const db = mongoose.connection;

//define event listeners for db connection
db.on("connected", () => {
  console.log("Connected to mongodb server");
});
// Connection error
db.on("error", (err) => console.error("MongoDB connection error:", err));

// Connection disconnected
db.on("disconnected", () => console.log("Disconnected from MongoDB"));

//export db connection
module.exports = db;
