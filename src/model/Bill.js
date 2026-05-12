const billSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },

  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
  },

  items: [
    {
      serviceName: {
        type: String,
        required: true,
      },

      amount: {
        type: Number,
        required: true,
      },
    },
  ],

  total: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: ["PENDING", "PAID", "PARTIAL"],
    default: "PENDING",
  },

  createdByEmployeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
});

module.exports = mongoose.model("Bill", billSchema);