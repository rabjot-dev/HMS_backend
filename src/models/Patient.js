const mongoose = require("mongoose");
const STATUS = require("../constants/status");
const patientSchema = new mongoose.Schema(
    {
        uhid: { type: String, required: true, unique: true, trim: true, },
        name: { type: String, required: true, trim: true, },
        phone: { type: String, required: true, trim: true, },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true, },
        gender: { type: String, required: true, enum: ["MALE", "FEMALE", "OTHER"], },
        dob: { type: Date, required: true, },
        address: { type: String, required: true, trim: true, },
        status: { type: String, enum: [STATUS.ACTIVE, STATUS.INACTIVE], default: STATUS.ACTIVE, },
    },
    {
        timestamps: true, versionKey: false,
    },
);

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;