const express = require("express");

const authMiddleware = require(
  "../middleware/auth.middleware",
);

const roleMiddleware = require(
  "../middleware/role.middleware",
);

const validateMiddleware = require(
  "../middleware/validate.middleware",
);

const {
  registerEmployeeValidation,
} = require(
  "../validations/employee.validation",
);

const {
  createEmployee,
} = require(
  "../controllers/employee.controller",
);

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  registerEmployeeValidation,
  validateMiddleware,
  createEmployee,
);

module.exports = router;