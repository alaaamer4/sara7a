const dotenv = require("dotenv");
const express = require("express");
const post = require("./routes/posts");
const app = express();
const auth = require("./routes/auth");
const messages = require("./routes/messages");
const dbConnection = require("./config/DB");
const user = require("./routes/users");
const profile = require("./routes/profile");

// load environment var
dotenv.config({ path: "./config/config.env" });

// setting view.
// view components goes here

// setting routes aka controls
app.use(express.json());
app.use("/api/users", user);
app.use("/api/posts", post);
app.use("/api/profiles", profile);
app.use("/api/auth", auth);
app.use("/api/messages", messages);
// handel DB
dbConnection();
// connect to server
const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} on port ${PORT}`)
);
