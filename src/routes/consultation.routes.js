const express = require("express");
const router = express.Router();
const ROLES = require("../constants/roles")
const {
  createConsultation,
  getConsultationByAppointment,
  updateConsultation,
  getConsultations,
  downloadPrescriptionPdf,
  getConsultationById,
  deleteConsultation
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
  downloadPrescriptionPdf,
);

router.get("/:id", getConsultationById);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN
  ),
  deleteConsultation
);

module.exports = router;
