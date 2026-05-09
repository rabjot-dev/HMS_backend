const mongoose = require("mongoose");

const connectDB = async () => {
    if(mongoose.connection <= 1)return;
    await mongoose.connect(process.env.MONGO_URI);
};

module.exports = connectDB;