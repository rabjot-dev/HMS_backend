const mongoose = require("mongoose")
const appointmentSchema = new mongoose.Schema({
  appointmentId: {
    type: String,
    unique: true,
    required: true,
  },

  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },

  doctorEmployeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  timeSlot: {
    startTime: String,
    endTime: String,
  },

  status: {
    type: String,
    enum: ["BOOKED", "CANCELLED", "COMPLETED"],
    default: "BOOKED",
  },

  createdByEmployeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);