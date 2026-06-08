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
} = require("../controllers/appointment.controller");

const authMiddleware = require("../middleware/auth.middleware");

const roleMiddleware = require("../middleware/role.middleware");

/*
|--------------------------------------------------------------------------
| Doctor Queue
|--------------------------------------------------------------------------
*/
router.get(
  "/doctor-queue",

  authMiddleware,

  roleMiddleware("DOCTOR"),

  getDoctorQueue,
);

/*
|--------------------------------------------------------------------------
| Available Slots
|--------------------------------------------------------------------------
*/
router.get(
  "/available-slots",

  authMiddleware,

  getAvailableSlots,
);

/*
|--------------------------------------------------------------------------
| Get All Appointments
|--------------------------------------------------------------------------
*/
router.get(
  "/",

  authMiddleware,

  getAppointments,
);

/*
|--------------------------------------------------------------------------
| Get Appointment By ID
|--------------------------------------------------------------------------
*/
router.get(
  "/:id",

  authMiddleware,

  getAppointmentById,
);

/*
|--------------------------------------------------------------------------
| Book Appointment
|--------------------------------------------------------------------------
*/
router.post(
  "/",

  authMiddleware,

  roleMiddleware("ADMIN", "RECEPTIONIST"),

  bookAppointment,
);

/*
|--------------------------------------------------------------------------
| Update Appointment
|--------------------------------------------------------------------------
*/
router.put(
  "/:id",

  authMiddleware,

  roleMiddleware("ADMIN", "RECEPTIONIST"),

  updateAppointment,
);

/*
|--------------------------------------------------------------------------
| Delete Appointment
|--------------------------------------------------------------------------
*/
router.delete(
  "/:id",

  authMiddleware,

  roleMiddleware("ADMIN", "RECEPTIONIST"),

  deleteAppointment,
);

module.exports = router;
