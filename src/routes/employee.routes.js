const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const validateMiddleware = require("../middleware/validate.middleware");
const {
  registerEmployeeValidation,
} = require("../validations/employee.validation");
const { createEmployee } = require("../controllers/employee.controller");
const { getEmployees } = require("../controllers/employee.controller");
const { getEmployeeById } = require("../controllers/employee.controller");
const { updateEmployee } = require("../controllers/employee.controller");
const { deactivateEmployee } = require("../controllers/employee.controller");
const { getDoctors } = require("../controllers/employee.controller");
const { activateEmployee } = require("../controllers/employee.controller");
const {
  getPendingEmployees,
  updateDoctorAvailability,

  getDoctorAvailability,
  approveEmployee,
  rejectEmployee,
} = require("../controllers/employee.controller");
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  registerEmployeeValidation,
  validateMiddleware,
  createEmployee,
);
router.get("/doctors", getDoctors);

//Doctor Availability
router.get("/doctor/availability", authMiddleware, getDoctorAvailability);

router.patch("/doctor/availability", authMiddleware, updateDoctorAvailability);

//Pending-Approve-Reject,Activate,Deactivate--Employees
router.get("/", authMiddleware, roleMiddleware("ADMIN"), getEmployees);
router.get("/pending-employees", authMiddleware, getPendingEmployees);
router.patch("/:id/approve-employee", authMiddleware, approveEmployee);
router.patch("/:id/reject-employee", authMiddleware, rejectEmployee);
router.patch(
  "/:id/deactivate",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deactivateEmployee,
);
router.get("/:id", authMiddleware, roleMiddleware("ADMIN"), getEmployeeById);
router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), updateEmployee);
router.patch(
  "/:id/activate",
  authMiddleware,
  roleMiddleware("ADMIN"),
  activateEmployee,
);
module.exports = router;
