const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const validateMiddleware = require("../middleware/validate.middleware");
const {
  loginValidation,
  createPasswordValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  registerValidation,
} = require("../validations/auth.validation");
const {
  login,
  createPassword,
  getCurrentUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");
const { register } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/login", loginValidation, validateMiddleware, login);
router.post(
  "/create-password",
  createPasswordValidation,
  validateMiddleware,
  createPassword,
);
router.get("/me", authMiddleware, getCurrentUser);
router.post("/register", registerValidation, validateMiddleware, register);
router.post(
  "/forgot-password",
  forgotPasswordValidation,
  validateMiddleware,
  forgotPassword,
);
router.post(
  "/reset-password",
  resetPasswordValidation,
  validateMiddleware,
  resetPassword,
);
module.exports = router;
