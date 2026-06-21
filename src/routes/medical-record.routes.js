const express = require("express");

const {
  getPrescriptions,
  getPatientPrescriptions,
  getMyPrescriptions,
  getPrescriptionById,
  getLabReports,
} = require("../controllers/medical-record.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

router.get(
  "/prescriptions",
  authMiddleware,
  roleMiddleware("ADMIN", "RECEPTIONIST", "DOCTOR"),
  getPrescriptions
);

router.get(
  "/prescriptions/my",
  authMiddleware,
  roleMiddleware("PATIENT"),
  getMyPrescriptions
);

router.get(
  "/prescriptions/patient/:patientId",
  authMiddleware,
  roleMiddleware("ADMIN", "RECEPTIONIST", "DOCTOR"),
  getPatientPrescriptions
);

router.get(
  "/prescriptions/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "RECEPTIONIST", "DOCTOR", "PATIENT"),
  getPrescriptionById
);

router.get(
  "/lab-reports",
  authMiddleware,
  roleMiddleware("ADMIN", "RECEPTIONIST", "DOCTOR"),
  getLabReports
);

router.get(
  "/lab-reports/my",
  authMiddleware,
  roleMiddleware("PATIENT"),
  getLabReports
);

module.exports = router;
