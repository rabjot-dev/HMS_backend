const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("node:crypto");
const Employee = require("../model/Employee");

exports.signup = async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      phone,
      department,
      designation,
      medical_reg_number,
      status,
      specialisation,
      role,
    } = req.body;

    console.log("STEP 1");

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const employee = await Employee.create({
      name,
      phone,
      email,
      department,
      designation,
      medical_reg_number,
      specialisation,
      status,
    });

    console.log("EMPLOYEE CREATED");

    const user = await User.create({
      email,
      password_hash,
      role,
      employeeId: employee.employeeCode,
      status,
    });

    console.log("USER CREATED");

    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (e) {
    console.error("FULL ERROR:", e);

    return res.status(500).json({
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user existence
    const duplicate = await User.findOne({ email });

    if (!duplicate) {
      return res.status(404).json({
        message: "User does not exist",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, duplicate.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect Password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: duplicate._id,
        role: duplicate.role,
        email: duplicate.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // First login check
    if (duplicate.isFirstLogin) {
      return res.status(200).json({
        message: "First login detected. Please reset your password.",
        isFirstLogin: true,
        token,
      });
    }

    // Successful login
    return res.status(200).json({
      message: "User logged in successfully",
      token,
      role: duplicate.role,
      email: duplicate.email,
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//get all users

exports.getAllUsers = async (req, res) => {
  try {
    const getAll = await User.find();
    return res.status(200).json({
      success: true,
      message: "all records fetched succesfully",
      count: getAll.length,
      data: getAll,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "error during fetching all records" });
  }
};

// get profile
// get profile

exports.currUser = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Find employee using employeeCode
    const employee = await Employee.findOne({
      employeeCode: user.employeeId,
    });

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        last_login: user.updated_at,

        // employee details
        name: employee.name,
        phone: employee.phone,
        employeeCode: employee.employeeCode,
        designation: employee.designation,
      },
    });

  } catch (error) {

    console.error("Unavailable to fetch current user", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

//  change password

exports.resetPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id); // ← add this line
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const password_hash = await bcrypt.hash(newPassword, 12);

    await User.findByIdAndUpdate(req.user.id, {
      password_hash,
      isFirstLogin: false, // ← add this
    });
    return res
      .status(200)
      .json({ message: "Password reset successfully. Please login again." }); // ← add this
  } catch (e) {
    console.error("FULL ERROR:", e);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: e.message });
  }
};
