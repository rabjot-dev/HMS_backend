const express = require("express");

const router = express.Router();

const ROLES = require("../constants/roles");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const validateMiddleware = require("../middleware/validate.middleware");

const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  registerPatientMobile,
  getProfile,
  updateProfile,
  deletePatient,
  getPatientDashboard,
} = require("../controllers/patient.controller");

const {
  createPatientValidation,
  updatePatientValidation,
} = require("../validations/patient.validation");

const {
  registerPatientMobileValidation,
} = require("../validations/register-patient-mobile.validation");

// Create patient

router.post(
  "/",
  authMiddleware,
  roleMiddleware(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.RECEPTIONIST,
  ),
  createPatientValidation,
  validateMiddleware,
  createPatient,
);

// Get all patients

router.get(
  "/",
  authMiddleware,
  roleMiddleware(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.RECEPTIONIST,
    ROLES.DOCTOR,
  ),
  getPatients,
);

// Patient profile

router.get(
  "/profile",
  authMiddleware,
  roleMiddleware(ROLES.PATIENT),
  getProfile,
);

// Update patient profile

router.put(
  "/profile",
  authMiddleware,
  roleMiddleware(ROLES.PATIENT),
  updatePatientValidation,
  validateMiddleware,
  updateProfile,
);

// Patient dashboard

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware(ROLES.PATIENT),
  getPatientDashboard,
);

// Get patient by id

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.RECEPTIONIST,
    ROLES.DOCTOR,
  ),
  getPatientById,
);

// Update patient

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.RECEPTIONIST,
  ),
  updatePatientValidation,
  validateMiddleware,
  updatePatient,
);

// Mobile registration

router.post(
  "/register",
  registerPatientMobileValidation,
  validateMiddleware,
  registerPatientMobile,
);

// Delete patient

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
  ),
  deletePatient,
);

module.exports = router;