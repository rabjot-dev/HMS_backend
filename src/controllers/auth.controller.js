const loginUser = require("../services/auth/login.service");
const getCurrentLoggedInUser = require("../services/auth/get-current-user.service");
const createEmployeePassword = require("../services/auth/create-password.service");
const registerEmployeeSelf = require("../services/auth/registerEmployeeSelf.service");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Employee = require("../models/Employee");

//login
const login = async (req, res) => {
  try {
    const loginResponse = await loginUser(req.body);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: loginResponse,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//create password
const createPassword = async (req, res) => {
  try {
    const serviceResponse = await createEmployeePassword(req.body);

    return res.status(200).json({
      success: true,
      message: serviceResponse.message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//get current logged in user

const getCurrentUser = async (req, res) => {
  try {
    const user = await getCurrentLoggedInUser(req.user.userId);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//self register
const register = async (req, res) => {
  const result = await registerEmployeeSelf(req.body);

  return res.status(201).json({
    success: true,
    message: result.message,
  });
};
//Forgot Password

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //Security Question

    return res.status(200).json({
      success: true,
      securityQuestion: user?.securityQuestion,
    });
  } catch (error) {
    console.log(error);
    console.log("FORGOT PASSWORD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
//Reset Password

const resetPassword = async (req, res) => {
  try {
    const { email, securityAnswer, newPassword } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //Verify Security Answer
    if (user?.securityAnswer?.toLowerCase() !== securityAnswer?.toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: "Invalid security answer",
      });
    }

    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    //Update Password
    user.passwordHash = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
module.exports = {
  login,
  createPassword,
  getCurrentUser,
  register,
  forgotPassword,
  resetPassword,
};
