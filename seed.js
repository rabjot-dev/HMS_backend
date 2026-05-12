const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/model/User");
require("dotenv").config();

const seedAdmin = async () => {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await User.findOne({ email: "admin@hospital.com" });
    if (existingAdmin) {
        console.log("Admin already exists");
        process.exit();
    }

    const password_hash = await bcrypt.hash("admin123", 12);

    await User.create({
        email: "admin@hospital.com",
        password_hash,
        role: "Admin",
        status: "Active",
        isFirstLogin: false 
    });

    console.log("Admin created successfully");
    process.exit();
};

seedAdmin();