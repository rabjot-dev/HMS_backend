const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true,
    unique: true,
  },
  billId: {
    type: String,
  },

  amount: {
    type: Number,
    required: true,
  },

  method: {
    type: String,
    required: true,
    enum:["cash","card","UPI"]
  },

  paidAt: {
    type: Date,
    default: Date.now(),
  },

  receivedByEmployeeId: {
    type: String,
  },
});

paymentSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { name: 'payment' },
                { $inc: { seq: 1 } }, 
                { new: true, upsert: true } 
            );
            this.paymentId = `PAY-${String(counter.seq).padStart(6, '0')}`; 
        } catch (err) {
            return next(err);
        }
    }
    
});
module.exports = mongoose.model("Payment", paymentSchema);
