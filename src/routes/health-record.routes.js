const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const roleMiddleware = require("../middleware/role.middleware");
const upload = require("../middleware/upload.middleware");
const ROLES = require("../constants/roles");

const {
  getHealthRecords,
  getHealthRecordDetails,
  addLabReport,
  deleteLabReport,
  addMedicalDocument,
  deleteMedicalDocument,
} = require("../controllers/health-record.controller");

router.get(
  "/",
  authMiddleware,
  roleMiddleware(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.RECEPTIONIST,
    ROLES.DOCTOR,
  ),
  getHealthRecords,
);

router.get(
  "/:patientId",
  authMiddleware,
  roleMiddleware(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.RECEPTIONIST,
    ROLES.DOCTOR,
  ),
  getHealthRecordDetails,
);

router.delete(
  "/:patientId/lab-reports/:reportId",
  authMiddleware,
  roleMiddleware(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  deleteLabReport,
);

router.delete(
  "/:patientId/medical-documents/:documentId",
  authMiddleware,
  roleMiddleware(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  deleteMedicalDocument,
);

router.post(
  "/:patientId/lab-reports",
  authMiddleware,
  roleMiddleware(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.RECEPTIONIST,
    ROLES.DOCTOR,
  ),
  upload.single("document"),
  addLabReport,
);

router.post(
  "/:patientId/medical-documents",
  authMiddleware,
  roleMiddleware(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.RECEPTIONIST,
    ROLES.DOCTOR,
  ),
  upload.single("document"),
  addMedicalDocument,
);
module.exports = router;
