const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {

    employeeCode: {
  type: String,
  unique: true,
  sparse: true,
},
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    password_hash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["ADMIN", "EMPLOYEE", "DOCTOR", "DESK", "PHARMACY", "HR"],
      default: "EMPLOYEE",
    },

    department: {
      type: String,
    },

    designation: {
      type: String,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "LOCKED"],
      default: "ACTIVE",
    },
    temporaryPassword: {
  type: String,
},

isFirstLogin: {
  type: Boolean,
  default: false,
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
