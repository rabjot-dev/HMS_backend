const express = require("express");

const {
  getPrescriptions,
  getPatientPrescriptions,
  getMyPrescriptions,
  getPrescriptionById,
  getLabReports,
  createHealthRecord,
  getHealthRecords,
  getPatientHealthRecords,
  getMyHealthRecords,
  getHealthRecordById,
  updateHealthRecord,
  deleteHealthRecord,
} = require("../controllers/medical-record.controller");
const authMiddleware = require("../middleware/auth.middleware");
const healthRecordUpload = require("../middleware/health-record-upload.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

router.get(
  "/health-records",
  authMiddleware,
  roleMiddleware("ADMIN", "RECEPTIONIST", "DOCTOR"),
  getHealthRecords
);

router.post(
  "/health-records",
  authMiddleware,
  roleMiddleware("ADMIN", "RECEPTIONIST"),
  healthRecordUpload.single("documentFile"),
  createHealthRecord
);

router.get(
  "/health-records/my",
  authMiddleware,
  roleMiddleware("PATIENT"),
  getMyHealthRecords
);

router.get(
  "/health-records/patient/:patientId",
  authMiddleware,
  roleMiddleware("ADMIN", "RECEPTIONIST", "DOCTOR"),
  getPatientHealthRecords
);

router.get(
  "/health-records/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "RECEPTIONIST", "DOCTOR", "PATIENT"),
  getHealthRecordById
);

router.put(
  "/health-records/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "RECEPTIONIST"),
  healthRecordUpload.single("documentFile"),
  updateHealthRecord
);

router.delete(
  "/health-records/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "RECEPTIONIST"),
  deleteHealthRecord
);

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
