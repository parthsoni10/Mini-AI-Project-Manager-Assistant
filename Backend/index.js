const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./src/config/db");
const app = require("./src/app");

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listing at port ${PORT}`);
  });
});