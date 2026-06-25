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
  updateMedicalDocument,
  updateLabReport,
} = require("../controllers/health-record.controller");

// Get all health records

router.get(
  "/",
  authMiddleware,
  roleMiddleware(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.RECEPTIONIST,
    ROLES.DOCTOR
  ),
  getHealthRecords
);

// Patient's own health record

router.get(
  "/me",
  authMiddleware,
  roleMiddleware(
    ROLES.PATIENT
  ),
  async (req, res, next) => {
    try {
      req.params.patientId =
        req.user.patientId;

      return getHealthRecordDetails(
        req,
        res,
        next
      );
    } catch (error) {
      next(error);
    }
  }
);

// Health record by patient id

router.get(
  "/:patientId",
  authMiddleware,
  roleMiddleware(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.RECEPTIONIST,
    ROLES.DOCTOR
  ),
  getHealthRecordDetails
);

// Add lab report

router.post(
  "/:patientId/lab-reports",
  authMiddleware,
  roleMiddleware(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.RECEPTIONIST,
    ROLES.DOCTOR
  ),
  upload.single("document"),
  addLabReport
);

// Update lab report

router.put(
  "/:patientId/lab-reports/:reportId",
  authMiddleware,
  roleMiddleware(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.RECEPTIONIST,
    ROLES.DOCTOR
  ),
  upload.single("document"),
  updateLabReport
);

// Delete lab report

router.delete(
  "/:patientId/lab-reports/:reportId",
  authMiddleware,
  roleMiddleware(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN
  ),
  deleteLabReport
);

// Add medical document

router.post(
  "/:patientId/medical-documents",
  authMiddleware,
  roleMiddleware(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.RECEPTIONIST,
    ROLES.DOCTOR
  ),
  upload.single("document"),
  addMedicalDocument
);

// Update medical document

router.put(
  "/:patientId/medical-documents/:documentId",
  authMiddleware,
  roleMiddleware(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.RECEPTIONIST,
    ROLES.DOCTOR
  ),
  upload.single("document"),
  updateMedicalDocument
);

// Delete medical document

router.delete(
  "/:patientId/medical-documents/:documentId",
  authMiddleware,
  roleMiddleware(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN
  ),
  deleteMedicalDocument
);

module.exports = router;