const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const nodePermissionMiddleware = require("../middleware/node-permission.middleware");
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
  nodePermissionMiddleware,
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
  nodePermissionMiddleware,
  getHealthRecordDetails
);

// Add lab report

router.post(
  "/:patientId/lab-reports",
  authMiddleware,
  nodePermissionMiddleware,
  upload.single("document"),
  addLabReport
);

// Update lab report

router.put(
  "/:patientId/lab-reports/:reportId",
  authMiddleware,
  nodePermissionMiddleware,
  upload.single("document"),
  updateLabReport
);

// Delete lab report

router.delete(
  "/:patientId/lab-reports/:reportId",
  authMiddleware,
  nodePermissionMiddleware,
  deleteLabReport
);

// Add medical document

router.post(
  "/:patientId/medical-documents",
  authMiddleware,
  nodePermissionMiddleware,
  upload.single("document"),
  addMedicalDocument
);

// Update medical document

router.put(
  "/:patientId/medical-documents/:documentId",
  authMiddleware,
  nodePermissionMiddleware,
  upload.single("document"),
  updateMedicalDocument
);

// Delete medical document

router.delete(
  "/:patientId/medical-documents/:documentId",
  authMiddleware,
  nodePermissionMiddleware,
  deleteMedicalDocument
);

module.exports = router;
