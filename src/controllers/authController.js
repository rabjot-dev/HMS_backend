const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const EmployeeSignupRequest = require("../models/EmployeeSignupRequest");

exports.registerEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      department,
      designation,
      experience,
      qualification,
      role,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !department ||
      !designation ||
      !role
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const existingRequest = await EmployeeSignupRequest.findOne({
      email,
      status: "PENDING",
    });

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message: "Registration request already pending",
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const request = await EmployeeSignupRequest.create({
      name,
      email,
      phone,
      password_hash,
      department,
      designation,
      experience,
      qualification,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "Registration submitted. Please wait for admin approval.",
      data: request,
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      const pendingRequest = await EmployeeSignupRequest.findOne({ email });

      if (pendingRequest?.status === "PENDING") {
        return res.status(403).json({
          success: false,
          message: "Your registration is pending admin approval",
        });
      }

      if (pendingRequest?.status === "REJECTED") {
        return res.status(403).json({
          success: false,
          message: "Your registration was rejected by admin",
        });
      }

      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        message: "Your account is not active",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation,
        employeeCode: user.employeeCode,
        isFirstLogin: user.isFirstLogin,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password_hash -temporaryPassword");

    return res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.resetTemporaryPassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, old password and new password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    user.password_hash = newPasswordHash;
    user.temporaryPassword = "";
    user.isFirstLogin = false;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. Please login with new password.",
    });

  } catch (error) {
    console.log("RESET TEMP PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while resetting password",
    });
  }
};