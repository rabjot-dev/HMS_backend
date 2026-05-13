const mongoose = require("mongoose");
const ROLES = require("../constants/roles");
const STATUS = require("../constants/status");

const userSchema = new mongoose.Schema(
  {
    email: {type: String, required: true, unique: true, trim: true, lowercase: true,},
    passwordHash: { type: String, default: null, },
    roles: { type: [String], enum: Object.values(ROLES),required: true, },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", default: null, },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", default: null, },
    isPasswordCreated: { type: Boolean, default: false, },
    status: { type: String, enum: [STATUS.ACTIVE, STATUS.INACTIVE], default: STATUS.ACTIVE,},
    lastLoginAt: { type: Date, default: null, },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
const User = mongoose.model("User", userSchema);
module.exports = User;