const mongoose = require("mongoose")
const Counter = require("./Counter");

const patientSchema = new mongoose.Schema({
  UHID: {
    type: String,
    unique: true,
    required: true,
  },

  name: {
    type: String,
    required: true,
    trim:true
  },

  phone: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    unique:true
  },

  gender: {
    type: String,
    enum: ["MALE", "FEMALE", "OTHER"],
  },

  dob: {
    type: Date,
  },

  address: {
    type: String,
  },

  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
  }
});

patientSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { name: 'patients' },
                { $inc: { seq: 1 } }, // Creates sequence
                { new: true, upsert: true } // upsert is update and insert
            );
            this.UHID = `PAT-${String(counter.seq).padStart(6, '0')}`; // create 6 digit sequence number
        } catch (err) {
            return next(err);
        }
    }
    next();
});


module.exports = mongoose.model("Patient", patientSchema);