require("dotenv").config();
const connnectDB = require("./config/db");
const app = require("./app");
const seedAdmin = require("./seeds/seed-admin");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connnectDB();
    await seedAdmin();
    app.listen(PORT, "0.0.0.0", () => {
      console.log("Server running on port 5000");
    });
  } catch (error) {
    console.error("Failed to connect to the database", error);
    process.exit(1);
  }
};
startServer();
console.log("Database connected successfully");
