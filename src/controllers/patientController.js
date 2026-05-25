const Patient = require("../models/Patient");
const generatePatientCode = require("../utils/generatePatientCode");

exports.createPatient = async (req, res) => {
  try {

    const {
      name,
      age,
      gender,
      phone,
      address,
      bloodGroup,
      allergy
    } = req.body;

    if (!name || !age || !gender || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing"
      });
    }

    const patientCode = await generatePatientCode();

    const patient = await Patient.create({
      patientCode,
      name,
      age,
      gender,
      phone,
      address,
      bloodGroup,
      allergy,
      createdBy: req.user.id
    });

    return res.status(201).json({
      success: true,
      message: "Patient registered successfully",
      data: patient
    });

  } catch (error) {

    console.log("CREATE PATIENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating patient"
    });

  }
};

exports.getAllPatients = async (req, res) => {
  try {

    const patients = await Patient.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: patients
    });

  } catch (error) {

    console.log("GET PATIENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching patients"
    });

  }
};