const Patient = require("../models/Patient");

const generatePatientId = async () => {
  //Current Date
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");

  //Prefix
  const prefix = `PAT-${year}${month}`;

  //Find Latest Patient
  const latestPatient = await Patient.findOne({
    patientId: {
      $regex: `^${prefix}`,
    },
  })

    .sort({
      createdAt: -1,
    });

  // Sequence Number
  let sequence = 1;
  if (latestPatient) {
    const lastSequence = parseInt(latestPatient.patientId.slice(-5));
    sequence = lastSequence + 1;
  }

  //Final Patient ID
  const formattedSequence = String(sequence).padStart(5, "0");
  return `${prefix}${formattedSequence}`;
};

module.exports = generatePatientId;
