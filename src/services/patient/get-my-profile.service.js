const Patient = require("../../models/Patient");

const getMyProfile = async (patientId) => {
  const patient = await Patient.findOne({
    _id: patientId,
    isDeleted: false,
  }).populate({
    path: "assignedDoctor",
    select: "name department specialization",
    match: {
      isDeleted: false,
    },
  });

  if (!patient) {
    throw new Error("Patient not found");
  }

  return patient;
};

module.exports = getMyProfile;
