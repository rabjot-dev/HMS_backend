const express = require("express");
const router = express.Router();

const { signup, login, resetPassword, getAllEmployees, getEmployeeById, getMyProfile,updateEmployee} = require("../controller/authController");
const { validateSignup, validateLogin, validateResetPassword  } = require("../middleware/validate");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");


router.post("/signup", verifyToken, verifyAdmin, validateSignup, signup);
router.post("/login", validateLogin, login);
router.post("/reset-password", verifyToken, validateResetPassword, resetPassword);
router.get("/employees",getAllEmployees)
// router.get("/getEmployeeById/:id",getEmployeeById)
router.get('/profile', verifyToken, getMyProfile);
router.put('/employees/:id', verifyToken, verifyAdmin, updateEmployee);

module.exports = router;