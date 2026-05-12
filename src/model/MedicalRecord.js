const prescriptionSchema = new mongoose.Schema(
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

    symptoms: {
      type: String,
    },

    diagnosis: {
      type: String,
    },

    prescriptionItems: [
      {
        name: {
          type: String,
          required: true,
        },

        dosage: {
          type: String,
          required: true,
        },

        duration: {
          type: String,
          required: true,
        },
      },
    ],

    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Prescription",
  prescriptionSchema
);