const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  medicineName: {
    type: String,
    required: true,
  },

  dosage: {
    type: String,
    required: true,
  },

  frequency: {
    type: String,
    required: true,
  },

  duration: {
    type: String,
    required: true,
  },
});

const consultationSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
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

    diagnosis: {
      type: String,
      trim: true,
    },

    symptoms: [
      {
        type: String,
      },
    ],

    doctorNotes: {
      type: String,
      trim: true,
    },

    vitals: {
      bloodPressure: {
        type: String,
      },

      pulseRate: {
        type: Number,
      },

      oxygenLevel: {
        type: Number,
      },

      temperature: {
        type: Number,
      },

      weight: {
        type: Number,
      },
    },

    prescriptions: [prescriptionSchema],
    status: {
      type: String,
      enum: ["IN_PROGRESS", "COMPLETED"],
      default: "IN_PROGRESS",
    },
  },

  {
    timestamps: true,
    versionKey: false,
  },
);

const Consultation = mongoose.model("Consultation", consultationSchema);

module.exports = Consultation;
