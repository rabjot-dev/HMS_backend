const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const validateMiddleware = require("../middleware/validate.middleware");

const {
  registerEmployeeValidation,
} = require("../validations/employee.validation");

const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
} = require("../controllers/employee.controller");

/*
|--------------------------------------------------------------------------
| Create Employee
|--------------------------------------------------------------------------
*/
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  registerEmployeeValidation,
  validateMiddleware,
  createEmployee,
);

/*
|--------------------------------------------------------------------------
| Get All Employees
|--------------------------------------------------------------------------
*/
router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getEmployees,
);

/*
|--------------------------------------------------------------------------
| Get Employee By ID
|--------------------------------------------------------------------------
*/
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getEmployeeById,
);

/*
|--------------------------------------------------------------------------
| Update Employee
|--------------------------------------------------------------------------
*/
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateEmployee,
);

module.exports = router;