const mongoose = require("mongoose");
const Counter = require("./Counter");

const appointmentSchema = new mongoose.Schema({
  appointmentId: {
    type: String,
    required: true,
  },
  patientId: {
    type: String,
  },
  doctorEmployeeId: {
    type: String,
  },

  date: {
    type: Date,
  },

  timeSlot: {
    type: String,
  },

  status: {
    type: String,
    enum: ["BOOKED", "CANCELLED", "COMPLETED"],
  },

  createdByEmployeeId: {
    type: String,
  },
});

appointmentSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: "appointment" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true },
      );
      this.appointmentId = `APP-${String(counter.seq).padStart(6, "0")}`;
    } catch (error) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model("Appointment",appointmentSchema)
