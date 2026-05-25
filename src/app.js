process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
require("dotenv").config();
const express = require("express");  // imports express library
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const employeeSignupRoutes = require("./routes/employeeSignupRoutes");
const userRoutes = require("./routes/userRoutes");
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");


const app = express();  // creates express application

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/users", userRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);


app.get("/", (req, res) => {
  res.send("HMS Backend API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/employee-signups", employeeSignupRoutes);

module.exports = app;