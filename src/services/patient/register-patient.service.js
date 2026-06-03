const Patient = require("../../models/Patient");

const generatePatientId = require("../../utils/generatePatientId");

const registerPatient = async (patientData) => {
  const {
    //Basic Information
    firstName,
    lastName,
    dateOfBirth,
    gender,
    bloodGroup,
    maritalStatus,

    //Contact Information
    phone,
    email,
    address,
    city,
    state,
    pincode,
    country,

    //Emergency Contact
    emergencyContactName,
    emergencyContactPhone,
    relationship,

    //Medical Information
    allergies,
    chronicDiseases,
    currentMedications,
    pastSurgeries,
    medicalHistory,
    familyMedicalHistory,

    //Insurance Information
    insuranceProvider,
    insurancePolicyNumber,
    insuranceExpiryDate,
    insuranceCoverageAmount,

    //Hospital Information
    assignedDoctor,
    department,
    patientType,
  } = patientData;

  // Generate Patient ID
  const patientId = await generatePatientId();

  //Create Patient
  const patient = await Patient.create({
    patientId,
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
  });

  return {
    message: "Patient registered successfully",
    patient,
  };
};

module.exports = registerPatient;
