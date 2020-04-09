const dotenv = require("dotenv");
const express = require("express");
const app = express();
const messages = require("./routes/messages");
const dbConnection = require("./config/DB");
const user = require("./routes/users");

// load environment var
dotenv.config({ path: "./config/config.env" });

// setting view.
// view components goes here

// setting routes aka controls
app.use(express.json());
app.use("/api/users", user);
app.use("/api/messages", messages);
// handel DB
dbConnection();
// connect to server
const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} on port ${PORT}`)
);
