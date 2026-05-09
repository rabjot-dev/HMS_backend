const mongoose = require ("mongoose");

const paymentSchema = new mongoose.Schema (
     {


 
 billId:{
    type : String
 },
 
amount : {
    type : Number,
    required : true
},
 
method : {
    type :String,
    required :true
},
 
paidAt :{
    type : Date,
    default: Date.now()
},
 
receivedByEmployeeId :{
    type : String
}
}
);
module.exports = mongoose.model("Payment",paymentSchema);
