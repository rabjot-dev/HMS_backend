const express = require("express");

const router = express.Router();

const ROLES = require("../constants/roles");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

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
  roleMiddleware(ROLES.DOCTOR),
  createConsultation,
);

// Get all consultations

router.get(
  "/",
  authMiddleware,
  roleMiddleware(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.DOCTOR,
    ROLES.RECEPTIONIST,
  ),
  getConsultations,
);

// Get consultation by appointment

router.get(
  "/appointment/:appointmentId",
  authMiddleware,
  roleMiddleware(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.DOCTOR,
    ROLES.RECEPTIONIST,
  ),
  getConsultationByAppointment,
);

// Get consultation by id

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.DOCTOR,
    ROLES.RECEPTIONIST,
  ),
  getConsultationById,
);

// Update consultation

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(ROLES.DOCTOR),
  updateConsultation,
);

// Download prescription

router.get(
  "/prescription/:consultationId",
  authMiddleware,
  roleMiddleware(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.DOCTOR,
    ROLES.RECEPTIONIST,
  ),
  downloadPrescriptionPdf,
);

// Delete consultation

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
  ),
  deleteConsultation,
);

module.exports = router;