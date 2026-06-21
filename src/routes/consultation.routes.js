const express = require("express");
const router = express.Router();
const {
  createConsultation,
  getConsultationByAppointment,
  updateConsultation,
  getConsultations,
  downloadPrescriptionPdf,
  getConsultationById,
} = require("../controllers/consultation.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

//CREATE CONSULTATION
router.post(
  "/",
  authMiddleware,
  roleMiddleware("DOCTOR"),
  createConsultation,
);

//Get All Consultations

router.get(
  "/",
  authMiddleware,
  getConsultations,
);

//Download Prescription PDF

router.get(
  "/pdf/:consultationId",
  authMiddleware,
  downloadPrescriptionPdf,
);

//Get Consultation By Appointment

router.get(
  "/appointment/:appointmentId",
  authMiddleware,
  getConsultationByAppointment,
);

//Update Consultation

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("DOCTOR"),
  updateConsultation,
);

router.get(
  "/prescription/:consultationId",
  authMiddleware,
  downloadPrescriptionPdf,
);

router.get("/:id", authMiddleware, getConsultationById);

module.exports = router;
