
require("dotenv").config();

const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({
      email: process.env.ADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const password_hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    await User.create({
      name: "Main Admin",
      email: process.env.ADMIN_EMAIL,
      phone: "9999999999",
      password_hash,
      role: "ADMIN",
      department: "Admin",
      designation: "System Admin",
      status: "ACTIVE",
    });

    console.log("Admin created successfully");
    process.exit();
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedAdmin();