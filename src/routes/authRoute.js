const express = require("express");
const router = express.Router();

const { signup, login,  resetPassword, getAllEmployees,updateEmployee,getEmployeeById } = require("../controller/authController");
const { validateSignup, validateLogin, validatePatientSignup, validateResetPassword  } = require("../middleware/validate");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");


router.post("/employee/signup", verifyToken, verifyAdmin, validateSignup, signup);
router.post("/login", validateLogin, login);
router.post("/reset-password", verifyToken, validateResetPassword, resetPassword);
router.get("/getAllEmployees",getAllEmployees);
router.put("/employee/:employeeCode", updateEmployee);
router.get("/employee/:employeeCode", getEmployeeById);
module.exports = router;