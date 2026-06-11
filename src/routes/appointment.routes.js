const express = require("express");
const router = express.Router();

const {
  getAvailableSlots,
  bookAppointment,
  getAppointments,
  deleteAppointment,
  getAppointmentById,
  getAppointmentsByPatientId,
  getDoctorQueue,
  updatePatientAppointment,
} = require("../controllers/appointment.controller");

const {
  approveAppointment,
  rejectAppointment,
} = require("../controllers/appointment-approval.controller");

const { adminUpdate } = require("../controllers/appointment-admin.controller");

const {
  getPendingAppointments,
} = require("../controllers/appointment-pending.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

// =========================
// DOCTOR DASHBOARD
// =========================
router.get(
  "/doctor-queue",
  authMiddleware,
  roleMiddleware("DOCTOR"),
  getDoctorQueue,
);

// =========================
// SLOT MANAGEMENT
// =========================
router.get("/available-slots", authMiddleware, getAvailableSlots);

// =========================
// APPOINTMENT READ
// =========================
router.get("/", authMiddleware, getAppointments);

router.get(
  "/pending",
  authMiddleware,
  roleMiddleware("ADMIN", "RECEPTIONIST"),
  getPendingAppointments,
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("PATIENT"),
  updatePatientAppointment,
);

router.get("/:id", authMiddleware, getAppointmentById);

router.get("/patient/:patientId", authMiddleware, getAppointmentsByPatientId);

// =========================
// BOOK APPOINTMENT (BOTH WEB + MOBILE)
// =========================
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "RECEPTIONIST", "PATIENT"),
  bookAppointment,
);

// =========================
// ADMIN DIRECT UPDATE (WEB ONLY)
// =========================
router.put(
  "/:id/admin-update",
  authMiddleware,
  roleMiddleware("ADMIN", "RECEPTIONIST"),
  adminUpdate,
);

router.patch(
  "/:id/approve",
  authMiddleware,
  roleMiddleware("ADMIN", "RECEPTIONIST"),
  approveAppointment,
);

router.patch(
  "/:id/reject",
  authMiddleware,
  roleMiddleware("ADMIN", "RECEPTIONIST"),
  rejectAppointment,
);

// =========================
// DELETE APPOINTMENT (WEB ONLY)
// =========================
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "RECEPTIONIST"),
  deleteAppointment,
);

module.exports = router;
