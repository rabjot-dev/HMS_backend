const Patient = require("../../models/Patient");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const generatePatientId = require("../../utils/generatePatientId");
const sendEmail = require("../../utils/sendEmail"); // 🔥 ADD THIS

const generateRandomPassword = () => {
  return Math.random().toString(36).slice(-8); // simple temp password
};

const registerPatient = async (patientData) => {
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    bloodGroup,
    maritalStatus,

    phone,
    email,
    address,
    city,
    state,
    pincode,
    country,

    emergencyContactName,
    emergencyContactPhone,
    relationship,

    allergies,
    chronicDiseases,
    currentMedications,
    pastSurgeries,
    medicalHistory,
    familyMedicalHistory,

    insuranceProvider,
    insurancePolicyNumber,
    insuranceExpiryDate,
    insuranceCoverageAmount,

    assignedDoctor,
    department,
    patientType,
  } = patientData;

  // -------------------------
  // CHECK EXISTING USER
  // -------------------------
  const existingUser = await User.findOne({
    $or: [{ email }, { phone }],
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error("Email already registered");
    }

    if (existingUser.phone === phone) {
      throw new Error("Phone number already registered");
    }

    throw new Error("User already exists");
  }

  // -------------------------
  // GENERATE TEMP PASSWORD
  // -------------------------
  const tempPassword = generateRandomPassword();
  const hashedTempPassword = await bcrypt.hash(tempPassword, 10);

  // -------------------------
  // CREATE USER
  // -------------------------
  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,

    passwordHash: null,
    temporaryPasswordHash: hashedTempPassword,

    roles: ["PATIENT"],
    status: "ACTIVE",
    isFirstLogin: true,
  });

  // -------------------------
  // CREATE PATIENT
  // -------------------------
  const patientId = await generatePatientId();

  const patient = await Patient.create({
    patientId,
    userId: user._id,
    firstName,
    lastName,
    dateOfBirth,
    gender,
    bloodGroup,
    maritalStatus,

    phone,
    email,
    address,
    city,
    state,
    pincode,
    country,

    emergencyContactName,
    emergencyContactPhone,
    relationship,

    allergies,
    chronicDiseases,
    currentMedications,
    pastSurgeries,
    medicalHistory,
    familyMedicalHistory,

    insuranceProvider,
    insurancePolicyNumber,
    insuranceExpiryDate,
    insuranceCoverageAmount,

    assignedDoctor,
    department,
    patientType,

    user: user._id,
  });

  // -------------------------
  // SEND EMAIL WITH TEMP PASSWORD
  // -------------------------
  await sendEmail({
    to: email,
    subject: "Your Hospital Account Credentials",

    htmlContent: `
    <h2>Welcome ${firstName}</h2>

    <p>Your patient account has been created.</p>

    <p><b>Email:</b> ${email}</p>

    <p><b>Temporary Password:</b> ${tempPassword}</p>

    <p style="color:red;">
      Please login and change your password immediately.
    </p>

    <br/>
    <p>Thank you,<br/>Hospital Management System</p>
  `,
  });
  return {
    message: "Patient registered successfully and email sent",
    patient,
  };
};

module.exports = registerPatient;
