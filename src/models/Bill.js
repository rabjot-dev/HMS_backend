const mongoose = require("mongoose");
const Counter = require("./Counter");
const billSchema = new mongoose.Schema({
  Bill_Id: {
    type: String,
    required: true,
  },

  patientId: {
    type: String,
  },

  appointmentId: {
    type: String,
  },

  items: [
    {
      serviceName: {
        type: String,
      },
      amount: {
        type: String,
      },
    },
  ],

  total: {
    type: String,
  },

  status: {
    type: String,
    enum: ["PENDING", "PAID", "PARTIAL"],
  },

  createdByEmployeeId: {
    type: String,
  },
});

billSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: "bill" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true },
      );
      this.Bill_Id = `BILL-${String(counter.seq).padStart(6, "0")}`;
    } catch (error) {
      return next(err);
    }
  }
  next();
});
