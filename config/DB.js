const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    const connection = await mongoose.connect(process.env.connection, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log(`mongoDB connected  to ${connection.connection.host}`);
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = dbConnection;
