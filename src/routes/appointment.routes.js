const express = require("express");

const router = express.Router();

const ROLES = require("../constants/roles");

const {
  getAvailableSlots,
  bookAppointment,
  getAppointments,
  deleteAppointment,
  getAppointmentById,
  updateAppointment,
  getDoctorQueue,
  bookPatientAppointment,
  getMyAppointments,
  getPendingAppointments,
  approveAppointment,
  rejectAppointment,
  updateMyAppointment,
  cancelMyAppointment,
} = require("../controllers/appointment.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

// Get today's queue for a doctor

router.get(
  "/doctor-queue",
  authMiddleware,
  roleMiddleware(ROLES.DOCTOR),
  getDoctorQueue,
);

// Get available slots

router.get(
  "/available-slots",
  authMiddleware,
  getAvailableSlots,
);

// Get all appointments

router.get(
  "/",
  authMiddleware,
  getAppointments,
);

// Patient books appointment

router.post(
  "/patient/book",
  authMiddleware,
  roleMiddleware(ROLES.PATIENT),
  bookPatientAppointment,
);

// Patient appointments

router.get(
  "/my",
  authMiddleware,
  roleMiddleware(ROLES.PATIENT),
  getMyAppointments,
);

// Pending appointments

router.get(
  "/pending",
  authMiddleware,
  roleMiddleware(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.RECEPTIONIST,
  ),
  getPendingAppointments,
);

// Approve appointment

router.patch(
  "/:id/approve",
  authMiddleware,
  roleMiddleware(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.RECEPTIONIST,
  ),
  approveAppointment,
);

// Reject appointment

router.patch(
  "/:id/reject",
  authMiddleware,
  roleMiddleware(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.RECEPTIONIST,
  ),
  rejectAppointment,
);

// Patient update own appointment

router.put(
  "/my/:id",
  authMiddleware,
  roleMiddleware(ROLES.PATIENT),
  updateMyAppointment,
);

// Patient cancel own appointment

router.patch(
  "/my/:id/cancel",
  authMiddleware,
  roleMiddleware(ROLES.PATIENT),
  cancelMyAppointment,
);

// Get appointment by id

router.get(
  "/:id",
  authMiddleware,
  getAppointmentById,
);

// Book appointment (Admin/Receptionist/Super Admin)

router.post(
  "/",
  authMiddleware,
  roleMiddleware(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.RECEPTIONIST,
  ),
  bookAppointment,
);

// Update appointment

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.RECEPTIONIST,
  ),
  updateAppointment,
);

// Delete appointment

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.RECEPTIONIST,
    ROLES.PATIENT,
  ),
  deleteAppointment,
);

module.exports = router;