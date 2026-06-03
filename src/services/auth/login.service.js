const bcrypt = require("bcryptjs");

const User = require("../../models/User");

const Employee = require("../../models/Employee");

const generateToken = require("../../utils/generateToken");

const loginUser = async (loginData) => {
  const { loginId, password } = loginData;

  let user = null;

  const isEmailLogin = loginId.includes("@");

  //Login Using Email

  if (isEmailLogin) {
    user = await User.findOne({
      email: loginId.toLowerCase(),
    });
  } else {
    //Login Using Employee Code
    const employee = await Employee.findOne({
      employeeCode: loginId,
    });

    if (!employee) {
      throw new Error("Invalid credentials");
    }

    user = await User.findOne({
      employeeId: employee._id,
    });
  }

  //User Not Found
  if (!user) {
    throw new Error("User not exists");
  }

  //Account Status Checks
  if (user.status === "PENDING") {
    throw new Error("Your account is pending admin approval");
  }

  if (user.status === "REJECTED") {
    throw new Error("Your registration was rejected");
  }

  if (user.status === "INACTIVE") {
    throw new Error("Account is inactive");
  }

  let isPasswordValid = false;

  // First Login
  if (user.isFirstLogin) {
    console.log("FIRST LOGIN");
    console.log(user.temporaryPasswordHash);
    isPasswordValid = await bcrypt.compare(
      password,
      user.temporaryPasswordHash,
    );
  } else {
    //Normal Login

    console.log("NORMAL LOGIN");
    console.log(user.passwordHash);
    isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  }

  // Invalid Password
  if (!isPasswordValid) {
    throw new Error("Invalid Password");
  }

  //Generate JWT Token
  const tokenPayload = {
    userId: user._id,
    roles: user.roles,
  };

  const token = generateToken(tokenPayload);

  //Update Last Login
  user.lastLoginAt = new Date();
  await user.save();

  // Final Response
  return {
    token,
    user,
  };
};

module.exports = loginUser;
