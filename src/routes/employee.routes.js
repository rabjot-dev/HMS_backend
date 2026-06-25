const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const validateMiddleware = require("../middleware/validate.middleware");

const ROLES = require("../constants/roles");

const {
  registerEmployeeValidation,
} = require("../validations/employee.validation");

const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deactivateEmployee,
  getDoctors,
  activateEmployee,
  getPendingEmployees,
  updateDoctorAvailability,
  getDoctorAvailability,
  approveEmployee,
  rejectEmployee,
  deleteEmployee,
} = require("../controllers/employee.controller");

const router = express.Router();

// Create Employee

router.post(
  "/",
  authMiddleware,
  roleMiddleware(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  registerEmployeeValidation,
  validateMiddleware,
  createEmployee,
);

// Doctors

router.get("/doctors", getDoctors);

router.get("/doctor/availability", authMiddleware, getDoctorAvailability);

router.patch("/doctor/availability", authMiddleware, updateDoctorAvailability);

// Employee List

router.get(
  "/",
  authMiddleware,
  roleMiddleware(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  getEmployees,
);

// Pending Employees

router.get(
  "/pending-employees",
  authMiddleware,
  roleMiddleware(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  getPendingEmployees,
);

// Employee Approval

router.patch(
  "/:id/approve-employee",
  authMiddleware,
  roleMiddleware(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  approveEmployee,
);

router.patch(
  "/:id/reject-employee",
  authMiddleware,
  roleMiddleware(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  rejectEmployee,
);

// Employee Details

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  getEmployeeById,
);

// Update Employee

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  updateEmployee,
);

// Activate Employee

router.patch(
  "/:id/activate",
  authMiddleware,
  roleMiddleware(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  activateEmployee,
);

// Deactivate Employee

router.patch(
  "/:id/deactivate",
  authMiddleware,
  roleMiddleware(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  deactivateEmployee,
);

// Delete Employee

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  deleteEmployee,
);

module.exports = router;
