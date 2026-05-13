const express=require("express");
const cors=require("cors");
const app=express();
app.use(cors());
app.use(express.json());
app.get("/hms",(req,res)=>{
    res.status(200).json({success:true,
        message:"Welcome to HMS API"});
});
module.exports=app;