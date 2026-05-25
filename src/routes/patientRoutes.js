const express = require("express");

const router = express.Router();

const {
  createPatient,
  getAllPatients
} = require("../controllers/patientController");

const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/create",
  authMiddleware,
  createPatient
);

router.get(
  "/all",
  authMiddleware,
  getAllPatients
);

module.exports = router;