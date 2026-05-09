const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("node:crypto");
const User = require("../models/User");
const Patient = require("../models/Patient");
const Employee = require("../models/Employee");

exports.signup = async (req, res) => {
  // SIGNUP
  try {
    const {
      name,
      roles,
      email,
      password,
      phone,
      designation,
      department,
      joiningDate,
      specialization,
      qualification,
      availabilitySlots,
    } = req.body;

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const employee = await Employee.create([
      {
        name,
        email,
        phone,
        department,
        designation,
        joiningDate,
        specialization,
        qualification,
        availabilitySlots,
      },
    ]);

    const user = await User.create([
      {
        email,
        password_hash: password_hash,
        roles,
        employeeid: employee.employeeCode,
      },
    ]);

    return res.status(201).json({
      message: "Employee created successfully",
      employee,
      user,
    });
  } catch (error) {
    console.error("Signnup error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
};

//  LOGIN

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid email " });
    }
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(404).json({ message: "Invalid  password" });
    }
    user.lastLoginAt = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        roles: user.role,
        lastLoginAt: user.lastLoginAt,
      },
    });
  } catch (error) {
    console.error("Login error:",err);
    res.status(500).json({message: "Server error during login"});
  }
};
