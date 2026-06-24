const express = require("express");
const router = express.Router();
const {
  createConsultation,
  getConsultationByAppointment,
  getConsultations,
  downloadPrescriptionPdf,
  getConsultationById,
} = require("../controllers/consultation.controller");

const authMiddleware = require("../middleware/auth.middleware");
const permissionMiddleware = require("../middleware/permission.middleware");

//CREATE CONSULTATION
router.post(
  "/",
  authMiddleware,
  permissionMiddleware("consultation:create"),
  createConsultation,
);

//Get All Consultations

router.get(
  "/",
  authMiddleware,
  permissionMiddleware("consultation:list"),
  getConsultations,
);

//Download Prescription PDF

router.get(
  "/pdf/:consultationId",
  authMiddleware,
  permissionMiddleware("consultation:pdf"),
  downloadPrescriptionPdf,
);

//Get Consultation By Appointment

router.get(
  "/appointment/:appointmentId",
  authMiddleware,
  permissionMiddleware("consultation:by-appointment"),
  getConsultationByAppointment,
);

router.get(
  "/prescription/:consultationId",
  authMiddleware,
  permissionMiddleware("consultation:pdf"),
  downloadPrescriptionPdf,
);

router.get(
  "/:id",
  authMiddleware,
  permissionMiddleware("consultation:detail"),
  getConsultationById
);

module.exports = router;
