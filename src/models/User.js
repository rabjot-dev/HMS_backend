const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    roles: {
      type: String,
      enum: [
        "OWNER",
        "ADMIN",
        "DOCTOR",
        "RECEPTIONIST",
        "CASHIER",
        "NURSE",
        "LAB_TECH",
        "PHARMACIST",
      ],
      required: true,
    },
    employeeid: {
      type: String,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamp: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

module.exports = mongoose.model("User", userSchema);
