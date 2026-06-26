const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const nodePermissionMiddleware = require("../middleware/node-permission.middleware");

const {
  createConsultation,
  getConsultationByAppointment,
  updateConsultation,
  getConsultations,
  downloadPrescriptionPdf,
  getConsultationById,
  deleteConsultation,
} = require("../controllers/consultation.controller");

// Create consultation

router.post(
  "/",
  authMiddleware,
  nodePermissionMiddleware,
  createConsultation,
);

// Get all consultations

router.get(
  "/",
  authMiddleware,
  nodePermissionMiddleware,
  getConsultations,
);

// Get consultation by appointment

router.get(
  "/appointment/:appointmentId",
  authMiddleware,
  nodePermissionMiddleware,
  getConsultationByAppointment,
);

// Download prescription

router.get(
  "/prescription/:consultationId",
  authMiddleware,
  nodePermissionMiddleware,
  downloadPrescriptionPdf,
);

// Get consultation by id

router.get(
  "/:id",
  authMiddleware,
  nodePermissionMiddleware,
  getConsultationById,
);

// Update consultation

router.put(
  "/:id",
  authMiddleware,
  nodePermissionMiddleware,
  updateConsultation,
);

// Delete consultation

router.delete(
  "/:id",
  authMiddleware,
  nodePermissionMiddleware,
  deleteConsultation,
);

module.exports = router;
