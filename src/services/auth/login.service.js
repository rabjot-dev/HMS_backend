const bcrypt = require("bcryptjs");

const User = require("../../models/User");
const Employee = require("../../models/Employee");
const STATUS = require("../../constants/status");

const generateAccessToken = require("../../utils/generateAccessToken");
const generateRefreshToken = require("../../utils/generateRefreshToken");

const loginUser = async (loginData) => {
  const { loginId, password } = loginData;

  let user = null;

  const isEmailLogin = loginId.includes("@");

  if (isEmailLogin) {
    user = await User.findOne({
      email: loginId.toLowerCase(),
      isDeleted: false,
    });
  } else {
    const employee = await Employee.findOne({
      employeeCode: loginId,
      isDeleted: false,
    });

    if (!employee) {
      throw new Error("Invalid credentials");
    }

    user = await User.findOne({
      employeeId: employee._id,
      isDeleted: false,
    });
  }

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (user.status === STATUS.PENDING) {
    throw new Error("Your account is pending admin approval");
  }

  if (user.status === STATUS.REJECTED) {
    throw new Error("Your registration was rejected");
  }

  if (user.status === STATUS.INACTIVE) {
    throw new Error("Account is inactive");
  }

  let isPasswordValid = false;

  if (user.isFirstLogin) {
    isPasswordValid = await bcrypt.compare(
      password,
      user.temporaryPasswordHash
    );
  } else {
    isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash
    );
  }

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const tokenPayload = {
    userId: user._id,
    employeeId: user.employeeId,
    patientId: user.patientId,
    roles: user.roles,
  };

  const accessToken =
    generateAccessToken(tokenPayload);

  const refreshToken =
    generateRefreshToken(tokenPayload);

  user.refreshToken = refreshToken;
  user.lastLoginAt = new Date();

  await user.save();

  return {
    accessToken,
    refreshToken,
    user,
  };
};

module.exports = loginUser;