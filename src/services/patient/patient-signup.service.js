const Patient = require("../../models/Patient");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const generatePatientId = require("../../utils/generatePatientId");

const patientSignup = async (patientData) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phone,
      email,
      password,
      address,
      city,
      state,
      pincode,
      country,
      bloodGroup,
      maritalStatus,
      emergencyContactName,
      emergencyContactPhone,
      relationship,
    } = patientData;

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userDoc = new User({
      firstName,
      lastName,
      email,
      phone,
      passwordHash: hashedPassword,
      roles: ["PATIENT"],
      status: "ACTIVE",
      isFirstLogin: false,
    });

    const user = await userDoc.save();

    console.log("SAVED USER ROLES:", user.roles);
    const patientId = await generatePatientId();
    console.log("USER ID:", user._id);
    const patient = await Patient.create({
      userId: user._id,
      patientId,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phone,
      email,
      address,
      city,
      state,
      pincode,
      country,
      bloodGroup,
      maritalStatus,
      emergencyContactName,
      emergencyContactPhone,
      relationship,
    });

    return {
      userId: user._id,
      patientId: patient.patientId,
      patient,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = patientSignup;
