const express = require("express");
const router = express.Router();

const { signup, login, patientSignup, resetPassword } = require("../controller/authController");
const { validateSignup, validateLogin, validatePatientSignup, validateResetPassword  } = require("../middleware/validate");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");


router.post("/employee/signup", verifyToken, verifyAdmin, validateSignup, signup);
router.post("/patient/signup", validatePatientSignup, patientSignup);
router.post("/login", validateLogin, login);
router.post("/reset-password", verifyToken, validateResetPassword, resetPassword);

module.exports = router;