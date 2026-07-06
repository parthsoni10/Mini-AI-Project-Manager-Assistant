const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const extractRoutes = require("./routes/extractRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Frontend URL
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/extract", extractRoutes);
app.use("/api/tasks", taskRoutes);

// Fallback Route for API
app.get("/api", (req, res) => {
  res.json({ success: true, message: "Welcome to TaskFlow AI API" });
});

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
