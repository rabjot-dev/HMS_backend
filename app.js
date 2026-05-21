process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// 1. CORS first
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

// 2. JSON parser
app.use(express.json());

// 3. Imports
const Appointment = require("./src/model/Employee");
const authRoute = require("./src/routes/authRoute");

// 4. Routes last
app.use("/api", authRoute);

module.exports = app;