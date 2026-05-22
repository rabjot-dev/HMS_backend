const mongoose = require("mongoose")
const Counter = require("./Counter");
const employeeSchema = new mongoose.Schema({
    employeeCode: { type: String, unique: true, trim: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    department: {
        type: String,
        enum: ["OPD", "IPD", "Lab", "Pharmacy", "Admin"],
        required:true        
    },
    designation: {
        type: String,
        
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        required: true
    },
    specialisation: { type: String},
    medical_reg_number: { type: String },
    joining_date: { type: Date },
    consultationFee: { type: String }
});

employeeSchema.pre("save", async function () {

    if (!this.isNew) return;

    const counter = await Counter.findOneAndUpdate(
        { name: "employees" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );

    this.employeeCode = `EMP-${String(counter.seq).padStart(6, "0")}`;
});



module.exports = mongoose.model("Employee", employeeSchema);