const bcrypt = require("bcryptjs");

const Patient = require("../../models/Patient");
const User = require("../../models/User");

const ROLES = require("../../constants/roles");

const generateToken = require("../../utils/generateToken");

const signupPatient = async (patientData) => {
  const {
    name,
    email,
    password,
    phone,
    gender,
    dob,
    address,
    emergencyContact,
  } = patientData;

  const existingUser = await User.findOne({
    email: email.toLowerCase(),
  });

  if (existingUser) {
    throw new Error(
      "Account already exists with this email",
    );
  }

  const hashedPassword = await bcrypt.hash(
    password,
    10,
  );

  const patient = await Patient.create({
    uhid: `PAT-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    phone,
    gender,
    dob,
    address,
    emergencyContact,
  });

  const user = await User.create({
    email: email.toLowerCase(),
    passwordHash: hashedPassword,
    roles: [ROLES.PATIENT],
    patientId: patient._id,
    isFirstLogin: false,
  });

  const tokenPayload = {
    userId: user._id,
    roles: user.roles,
  };

  const token = generateToken(tokenPayload);

  return {
    token,
    user,
    patient,
  };
};

module.exports = signupPatient;