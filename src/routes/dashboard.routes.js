const express = require("express");
const authMiddleware =
  require("../middleware/auth.middleware");
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

  authMiddleware,
  getAdminStats,
);

router.get(
  "/recent-employees",

  authMiddleware,
  getRecentEmployees,
);

/*
|--------------------------------------------------------------------------
| Doctor
|--------------------------------------------------------------------------
*/
router.get(
  "/doctor-stats",
  authMiddleware,
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
  authMiddleware,
  getTodayAppointments,
);

module.exports = router;
