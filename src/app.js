const express = require("express");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const authRoutes = require("./routes/auth.routes");
const employeeRoutes = require("./routes/employee.routes");

const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);

// Global error handler
app.use((error, req, res, next) => {
  return res.status(500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

module.exports = app;
