const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// 🔹 Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(helmet()); // Security headers
app.use(express.json()); // Parse JSON bodies
app.use(morgan("dev")); // Logging

// 🔹 Database Connection
connectDB(); // Connect to MongoDB

// 🔹 Routes
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

// 🔹 Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// Export the app instance (to be used in `server.js`)
module.exports = app;
