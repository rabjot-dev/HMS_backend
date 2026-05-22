const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  resetPassword,
  getAllUsers,
  currUser,
} = require("../controller/authController");
const {
  validateSignup,
  validateLogin,
  validateResetPassword,
} = require("../middleware/validate");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

router.post(
  "/employee/signup",
  verifyToken,
  verifyAdmin,
  validateSignup,
  signup,
);
router.post("/login", validateLogin, login);
router.post(
  "/reset-password",
  verifyToken,
  validateResetPassword,
  resetPassword,
);
router.post(
  "/forgot-password",
  verifyToken,
  validateResetPassword,
  resetPassword,
);
router.get("/getAll", verifyToken, verifyAdmin, getAllUsers);
router.get("/current-user", verifyToken, currUser);

module.exports = router;
