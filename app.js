require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");


const app = express();

app.use(morgan("dev"))


app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
 

const Employee = require("./src/model/Employee")
const authRoute = require("./src/routes/authRoute");

app.use("/api",authRoute);

module.exports = app;
