const mongoose = require("mongoose");

const healthRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    documentType: {
      type: String,
      required: true,
      enum: [
        "PREVIOUS_DISCHARGE_SUMMARY",
        "LAB_REPORT",
        "SCAN_REPORT",
        "OTHER",
      ],
    },

    documentDate: {
      type: Date,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    originalFileName: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    deletedDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

healthRecordSchema.index({ patientId: 1, isDeleted: 1, createdAt: -1 });
healthRecordSchema.index({ documentType: 1, isDeleted: 1 });

module.exports = mongoose.model("HealthRecord", healthRecordSchema);
