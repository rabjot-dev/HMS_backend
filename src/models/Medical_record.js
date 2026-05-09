const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema({
  Serial_No: {
    type: String,
    required: true,
  },
  appointmentId: {
    type: String,
  },

  patientId: {
    type: String,
  },

  doctorEmployeeId: {
    type: String,
  },

  symptoms: {
    type: String,
    required: true,
  },

  diagnosis: {
    type: String,
  },

  prescriptionItems: [
    {
      name: {
        type: String,
      },
      dosage: {
        type: String,
      },
      duration: {
        type: String,
      },
    },
  ],

  notes: {
    type: String,
  },

  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

module.exports = mongoose.module("MedicalRecords", medicalRecordSchema);
