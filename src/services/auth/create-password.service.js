const bcrypt = require("bcryptjs");

const User = require("../../models/User");
const Employee = require("../../models/Employee");

const createEmployeePassword = async (passwordData) => {
  const {
    loginId,
    temporaryPassword,
    newPassword,
    securityQuestion,
    securityAnswer,
  } = passwordData;

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
      throw new Error("Invalid login ID");
    }

    user = await User.findOne({
      employeeId: employee._id,
      isDeleted: false,
    });
  }

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.isFirstLogin) {
    throw new Error("Password is already created for this account");
  }

  const isTemporaryPasswordValid = await bcrypt.compare(
    temporaryPassword,
    user.temporaryPasswordHash
  );

  if (!isTemporaryPasswordValid) {
    throw new Error("Invalid temporary password");
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  const hashedSecurityAnswer = await bcrypt.hash(
    securityAnswer.trim().toLowerCase(),
    10
  );

  user.passwordHash = hashedNewPassword;
  user.temporaryPasswordHash = null;
  user.isFirstLogin = false;
  user.securityQuestion = securityQuestion;
  user.securityAnswer = hashedSecurityAnswer;

  await user.save();

  return {
    message: "Password created successfully",
  };
};

module.exports = createEmployeePassword;