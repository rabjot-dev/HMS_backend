const mongoose = require("mongoose");
const STATUS = require("../constants/status");
const appointmentSchema = new mongoose.Schema(
    {
        appointmentId: { type: String, required: true, unique: true, trim: true, },
        patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true, },
        doctorEmployeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true, },
        appointmentDate: { type: Date, required: true, },
        timeSlot: { type: String, required: true, trim: true, },
        status: { type: String, enum: [STATUS.BOOKED, STATUS.CANCELLED, STATUS.COMPLETED,], default: STATUS.BOOKED, },
        createdByEmployeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true, },
    },
    {
        timestamps: true, versionKey: false,
    },
);

const Appointment = mongoose.model("Appointment", appointmentSchema,);
module.exports = Appointment;