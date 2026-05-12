const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    employeeId: {
        type: String,
        
    },
    patientId:{
        type:String
    },

    password_hash: {
        type: String,
        required: true,
    },

    status: {
        type: String,
        enum: ["Active", "Inactive"],
        required: true
    },

    role: {
        type: String,
        enum: [
            "Owner",
            "Admin",
            "Doctor",
            "Receptionist",
            "Cashier",
            "Nurse",
            "Lab_Tech",
            "Pharmacist",
            "Patient"
        ],
        required: true,
    },
    // add this field to userSchema
isFirstLogin: {
    type: Boolean,
    default: true
}

},
{
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
});

module.exports = mongoose.model("User", userSchema);