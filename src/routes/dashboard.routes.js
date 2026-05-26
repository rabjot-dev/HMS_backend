const express = require("express");

const router = express.Router();

const {
  getAdminStats,

  getRecentEmployees,

  getDoctorStats,

  getReceptionistStats,

  getTodayAppointments,
} = require("../controllers/dashboard.controller");

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/
router.get(
  "/admin-stats",

  getAdminStats,
);

router.get(
  "/recent-employees",

  getRecentEmployees,
);

/*
|--------------------------------------------------------------------------
| Doctor
|--------------------------------------------------------------------------
*/
router.get(
  "/doctor-stats",

  getDoctorStats,
);

/*
|--------------------------------------------------------------------------
| Receptionist
|--------------------------------------------------------------------------
*/
router.get(
  "/receptionist-stats",

  getReceptionistStats,
);

router.get(
  "/today-appointments",

  getTodayAppointments,
);

module.exports = router;
