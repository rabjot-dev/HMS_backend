const mongoose = require("mongoose");
const Counter = require("./Counter");

const patientSchema = new mongoose.Schema({
  UHID: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  dob: {
    type: Date,
  },
  address: {
    type: String,
    required: true,
  },
  emergencyContact: {
    type: String,
  },
  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
    required: true,
  },
});

patientSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: "patient" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true },
      );
      this.UHID = `PAT-${String(counter.seq).padStart(6, "0")}`;
    } catch (error) {
      return next(err);
    }
  }
  next();
});
module.exports = mongoose.model("Patient", patientSchema);
