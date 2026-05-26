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

/*
|--------------------------------------------------------------------------
| Role Middleware
|--------------------------------------------------------------------------
*/
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const userRoles = req.user.roles;

    const hasAccess = userRoles.some((role) => roles.includes(role));

    if (!hasAccess) {
      return res.status(403).json({
        success: false,

        message: "Access Denied",
      });
    }

    next();
  };
};

/*
|--------------------------------------------------------------------------
| Doctor Queue
|--------------------------------------------------------------------------
*/
router.get(
  "/doctor-queue",

  authMiddleware,

  authorizeRoles("DOCTOR"),

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

  authorizeRoles(
    "ADMIN",

    "RECEPTIONIST",
  ),

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

  authorizeRoles(
    "ADMIN",

    "RECEPTIONIST",
  ),

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

  authorizeRoles(
    "ADMIN",

    "RECEPTIONIST",
  ),

  deleteAppointment,
);

module.exports = router;
