const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUrl = (process.env.MONGO_URL || "").trim();

  if (!mongoUrl) {
    console.error("MONGO_URL is not defined in the .env file.");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB Atlas...");
    const conn = await mongoose.connect(mongoUrl);
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Atlas connection failed: ${error.message}`);
    console.error(
      "Troubleshooting tips:\n" +
      "  1. Ensure your IP is whitelisted in Atlas (Network Access → Add Current IP or 0.0.0.0/0)\n" +
      "  2. Check that the username/password in MONGO_URL are correct\n" +
      "  3. Verify the cluster name in the connection string\n" +
      "  4. Make sure your network/firewall allows outbound connections on port 27017"
    );
    process.exit(1);
  }
};

module.exports = connectDB;
