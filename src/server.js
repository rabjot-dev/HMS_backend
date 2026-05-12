require("dotenv").config();
const connnectDB = require("./config/db");
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connnectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database", error);
    process.exit(1);
  }
};
startServer();
    console.log("Database connected successfully");