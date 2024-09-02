const mongoose = require("mongoose");

const connectMongoDB = async (req, res) => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MONGODB connected:${db.connection.host}`);
  } catch (error) {
    console.log(`Error connection to mongoDB :${error.message}`);
    process.exit(1);
  }
};

module.exports = connectMongoDB;
