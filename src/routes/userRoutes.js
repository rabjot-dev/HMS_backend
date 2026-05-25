const express = require("express");
const router = express.Router();

const {
  createEmployeeByAdmin,
  getAllEmployees,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/create-employee",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createEmployeeByAdmin,
);

router.get(
  "/employees",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getAllEmployees,
);

module.exports = router;
