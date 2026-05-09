const mongoose = require("mongoose");
const Counter = require("./Counter");
const employeeSchema = new mongoose.Schema (
    {
        employeeCode : {type : String},
        name : {type : String, required: true},
        phone :{type : String, required : true},
        email : {type : String, unique: true, required: true, trim : true, lowercase : true},
        department: {type : String, required : true},
        designation : {type :String, required : true},
        status : {type :String, enum :["ACTIVE","INACTIVE"]},
        joiningDate :{type : Date},
        medicalRegistrationNo :{type : String,  unique : true},
        specialization : {type : String, required : true},
        qualification :[{type :String, required : true}],
        consultationFee : {type : String},
        availabilitySlots : [{type : String, required : true}]
        
    },
);

employeeSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { name: 'employee' },
                { $inc: { seq: 1 } }, 
                { new: true, upsert: true } 
            );
            this.employeeCode = `EMP-${String(counter.seq).padStart(6, '0')}`; 
        } catch (err) {
            return next(err);
        }
    }
    
});
module.exports=mongoose.model("Employee",employeeSchema);
