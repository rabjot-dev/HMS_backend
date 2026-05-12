const mongoose = require("mongoose");

const payementSchema = new payement.Schema({
    billId:{
        type:String,
        required:true
    },
    amount:{
        type:String,
        required:true
    },
    method:{
        type:String,
        enum:["CASH","CARD","UPI"],
        required:true
    },
    paidAt:{
        type:Date,
        required:true
    },
    createdByEmployeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  }
});

module.exports = mongoose.model("Payment",payementSchema);  