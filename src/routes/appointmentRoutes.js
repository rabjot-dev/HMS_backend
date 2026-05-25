const express = require("express");

const router = express.Router();

const {
  createAppointment,
  getAllAppointments,
  getDoctors,
  getAvailableSlots,
  updateAppointment,
  deleteAppointment,
  getMyAppointments,
} = require("../controllers/appointmentController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/create", authMiddleware, createAppointment);

router.get("/all", authMiddleware, getAllAppointments);

router.get("/doctors", authMiddleware, getDoctors);

router.get("/available-slots", authMiddleware, getAvailableSlots);

router.put("/:id", authMiddleware, updateAppointment);

router.delete("/:id", authMiddleware, deleteAppointment);

router.get("/my-appointments", authMiddleware, getMyAppointments);

module.exports = router;
