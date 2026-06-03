const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      unique: true,
    },

    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
      required: true,
    },

    bloodGroup: {
      type: String,
    },

    maritalStatus: {
      type: String,
      enum: ["SINGLE", "MARRIED", "DIVORCED"],
    },

    countryCode: {
      type: String,
      required: true,
      default: "+91",
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      match: /^[0-9]{10}$/,
    },

    email: {
      type: String,
    },

    address: {
      type: String,
    },

    city: {
      type: String,
    },

    state: {
      type: String,
    },

    pincode: {
      type: String,
    },

    country: {
      type: String,
    },

    emergencyContactName: {
      type: String,
    },

    emergencyContactPhone: {
      type: String,
    },

    relationship: {
      type: String,
    },

    allergies: [
      {
        type: String,
      },
    ],

    chronicDiseases: [
      {
        type: String,
      },
    ],

    currentMedications: [
      {
        type: String,
      },
    ],

    pastSurgeries: [
      {
        type: String,
      },
    ],

    medicalHistory: {
      type: String,
    },

    familyMedicalHistory: {
      type: String,
    },

    insuranceProvider: {
      type: String,
    },

    insurancePolicyNumber: {
      type: String,
    },

    insuranceExpiryDate: {
      type: Date,
    },

    insuranceCoverageAmount: {
      type: Number,
    },

    assignedDoctor: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Employee",
    },

    department: {
      type: String,
    },

    patientType: {
      type: String,

      enum: ["OPD", "IPD", "EMERGENCY"],

      default: "OPD",
    },

    status: {
      type: String,

      enum: ["ACTIVE", "DISCHARGED", "INACTIVE"],

      default: "ACTIVE",
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Patient", patientSchema);
