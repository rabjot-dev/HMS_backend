const mongoose = require("mongoose");
const STATUS = require("../constants/status");
const appointmentSchema = new mongoose.Schema(
  {
    appointmentId: { type: String, required: true, unique: true, trim: true },
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
    appointmentDate: { type: Date, required: true },
    timeSlot: { type: String, required: true, trim: true },
    tokenNumber: { type: Number },
    status: {
      type: String,
      enum: [
        STATUS.BOOKED,
        STATUS.CANCELLED,
        STATUS.COMPLETED,
        STATUS.IN_CONSULTATION,
        STATUS.NO_SHOW,
      ],
      default: STATUS.BOOKED,
    },
    createdByEmployeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    appointmentType: {
      type: String,

      enum: [
        "CONSULTATION",

        "FOLLOW_UP",

        "EMERGENCY",

        "VIDEO_CONSULTATION",

        "ROUTINE_CHECKUP",
      ],

      default: "CONSULTATION",
    },

    /*
|--------------------------------------------------------------------------
| Priority
|--------------------------------------------------------------------------
*/
    priority: {
      type: String,

      enum: ["NORMAL", "URGENT", "CRITICAL"],

      default: "NORMAL",
    },

    /*
|--------------------------------------------------------------------------
| Payment Status
|--------------------------------------------------------------------------
*/
    paymentStatus: {
      type: String,

      enum: ["PENDING", "PAID", "INSURANCE"],

      default: "PENDING",
    },

    /*
|--------------------------------------------------------------------------
| Visit Mode
|--------------------------------------------------------------------------
*/
    visitMode: {
      type: String,

      enum: ["OFFLINE", "ONLINE", "HOME_VISIT"],

      default: "OFFLINE",
    },

    /*
|--------------------------------------------------------------------------
| Symptoms
|--------------------------------------------------------------------------
*/
    symptoms: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Appointment =
  mongoose.models.Appointment ||
  mongoose.model(
    "Appointment",

    appointmentSchema,
  );
module.exports = Appointment;
