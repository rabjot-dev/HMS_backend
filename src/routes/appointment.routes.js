const express = require("express");

const router = express.Router();

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
  cancelMyAppointment
} = require("../controllers/appointment.controller");

const authMiddleware = require("../middleware/auth.middleware");
const permissionMiddleware = require("../middleware/permission.middleware");

// Get today's queue for a doctor
router.get(
  "/doctor-queue",
  authMiddleware,
  permissionMiddleware("appointment:doctor-queue"),
  getDoctorQueue
);

// Get available slots for a doctor
router.get(
  "/available-slots",
  authMiddleware,
  permissionMiddleware("appointment:available-slots"),
  getAvailableSlots
);

// Get all appointments
router.get(
  "/",
  authMiddleware,
  permissionMiddleware("appointment:list"),
  getAppointments
);

//Patient book appointment 
router.post(
  "/patient/book",
  authMiddleware,
  permissionMiddleware("appointment:patient-book"),
  bookPatientAppointment
);
// Only patients appointment 
router.get(
  "/my",
  authMiddleware,
  permissionMiddleware("appointment:my-list"),
  getMyAppointments
);
//Pending appointments
router.get(
  "/pending",
  authMiddleware,
  permissionMiddleware("appointment:pending-list"),
  getPendingAppointments
);
// Approve appointment 
router.patch(
  "/:id/approve",
  authMiddleware,
  permissionMiddleware("appointment:approve"),
  approveAppointment
);
// Reject appointment 
router.patch(
  "/:id/reject",
  authMiddleware,
  permissionMiddleware("appointment:reject"),
  rejectAppointment
);
//update patient
router.put(
  "/my/:id",
  authMiddleware,
  permissionMiddleware("appointment:my-update"),
  updateMyAppointment
);
//cancel appointment
router.patch(
  "/my/:id/cancel",
  authMiddleware,
  permissionMiddleware("appointment:my-cancel"),
  cancelMyAppointment
);

// Get appointment details by ID
router.get(
  "/:id",
  authMiddleware,
  permissionMiddleware("appointment:detail"),
  getAppointmentById
);

// Book a new appointment
router.post(
  "/",
  authMiddleware,
  permissionMiddleware("appointment:create"),
  bookAppointment
);

// Update appointment details
router.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("appointment:update"),
  updateAppointment
);

// Delete an appointment
router.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("appointment:delete"),
  deleteAppointment
);

module.exports = router;
