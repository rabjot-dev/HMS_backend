
const express = require("express");
const router = express.Router();

const {
  registerEmployee,
  login,
  me,
  getCurrentUser,
    resetTemporaryPassword,

} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/register-employee", registerEmployee);
router.post("/login", login);
router.get("/me", authMiddleware, me);
router.post("/reset-temporary-password", resetTemporaryPassword);
module.exports = router;