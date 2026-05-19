const mongoose = require("mongoose");

const connectDB = async()=>{
    try{
        await mongoose.connect("mongodb://localhost:27017/HMS_ORG");

        console.log("Connection established");
        
    }
    catch(e){
        console.error(e.message);
        process.exit();
        
    };
};

module.exports = connectDB;