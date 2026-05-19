require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
const Appointment = require("./src/model/Employee")
const authRoute = require("./src/routes/authRoute");

const cors = require("cors");


app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use("/api",authRoute);

module.exports = app;
