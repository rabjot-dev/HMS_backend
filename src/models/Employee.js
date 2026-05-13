const mongoose = require("mongoose");
const STATUS = require("../constants/status");
const employeeSchema = new mongoose.Schema(
    {
        employeeCode: { type: String, required: true, unique: true, trim: true, },
        name: { type: String, required: true, trim: true, },
        phone: { type: String, required: true, trim: true, },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true, },
        department: { type: String, required: true, trim: true, },
        designation: { type: String, required: true, trim: true, },
        joiningDate: { type: Date, required: true, },
        medicalRegistrationNo: { type: String, trim: true, default: null, },
        specialization: { type: String, trim: true, default: null, },
        qualification: { type: [String], default: [], },
        consultationFee: { type: Number, default: 0, },
        availabilitySlots: { type: [String], default: [], },
        status: { type: String, enum: [STATUS.ACTIVE, STATUS.INACTIVE], default: STATUS.ACTIVE, },
    },
    {
        timestamps: true, versionKey: false,
    },
);
const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;