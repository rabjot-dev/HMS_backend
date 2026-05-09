require ("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const { json } = require("body-parser");



const app = express();
app.use(express.json());
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(morgan("dev"));

app.get("/", (req, res) => res.json({ message: "API running" }));
 
const authRoutes = require("./src/routes/authRoutes");
app.use("/api/auth", authRoutes);

mongoose 
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

module.exports = app;

