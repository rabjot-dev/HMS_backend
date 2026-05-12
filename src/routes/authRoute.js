const express = require("express");
const router = express.Router();

const { signup, login, patientSignup } = require("../controller/authController");
const { validateSignup, validateLogin, validatePatientSignup } = require("../middleware/validate");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

router.post("/employee/signup", verifyToken, verifyAdmin, validateSignup, signup);
router.post("/patient/signup", validatePatientSignup, patientSignup);
router.post("/login", validateLogin, login);

module.exports = router;