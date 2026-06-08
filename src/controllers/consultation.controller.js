const createConsultationService = require("../services/consultation/create-consultation.service");

const getConsultationByIdService = require("../services/consultation/get-consultation-by-id.service");

const getConsultationByAppointmentService = require("../services/consultation/get-consultation-by-appointment.service");

const updateConsultationService = require("../services/consultation/update-consultation.service");

const getConsultationsService = require("../services/consultation/get-consultations.service");

const getPrescriptionDataService = require("../services/consultation/download-prescription-pdf.service");

const generatePrescriptionPdf = require("../utils/generatePrescriptionPdf");

/*
|--------------------------------------------------------------------------
| Create Consultation
|--------------------------------------------------------------------------
*/
const createConsultation = async (req, res) => {
  try {
    const consultation = await createConsultationService(req.body);

    return res.status(201).json({
      success: true,

      message: "Consultation created successfully",

      data: consultation,
    });
  } catch (error) {
    console.error("CREATE CONSULTATION ERROR:", error);

    if (error.message === "Consultation already exists") {
      return res.status(409).json({
        success: false,

        message: error.message,
      });
    }

    if (error.message === "Appointment not found") {
      return res.status(404).json({
        success: false,

        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,

      message: "Failed to create consultation",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Consultation By Appointment
|--------------------------------------------------------------------------
*/
const getConsultationByAppointment = async (req, res) => {
  try {
    const consultation =
      await getConsultationByAppointmentService(
        req.params.appointmentId,
      );

    return res.status(200).json({
      success: true,

      data: consultation,
    });
  } catch (error) {
    console.error(
      "GET CONSULTATION BY APPOINTMENT ERROR:",
      error,
    );

    if (error.message === "Consultation not found") {
      return res.status(404).json({
        success: false,

        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,

      message: "Failed to fetch consultation",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Update Consultation
|--------------------------------------------------------------------------
*/
const updateConsultation = async (req, res) => {
  try {
    const consultation =
      await updateConsultationService(
        req.params.id,
        req.body,
      );

    return res.status(200).json({
      success: true,

      message: "Consultation updated successfully",

      data: consultation,
    });
  } catch (error) {
    console.error("UPDATE CONSULTATION ERROR:", error);

    if (error.message === "Consultation not found") {
      return res.status(404).json({
        success: false,

        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,

      message: "Failed to update consultation",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get All Consultations
|--------------------------------------------------------------------------
*/
const getConsultations = async (req, res) => {
  try {
    const consultations = await getConsultationsService();

    return res.status(200).json({
      success: true,

      data: consultations,
    });
  } catch (error) {
    console.error("GET CONSULTATIONS ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch consultations",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Download Prescription PDF
|--------------------------------------------------------------------------
*/
const downloadPrescriptionPdf = async (req, res) => {
  try {
    const consultation =
      await getPrescriptionDataService(
        req.params.consultationId,
      );

    generatePrescriptionPdf(
      consultation,
      res,
    );
  } catch (error) {
    console.error(
      "DOWNLOAD PRESCRIPTION PDF ERROR:",
      error,
    );

    if (error.message === "Consultation not found") {
      return res.status(404).json({
        success: false,

        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,

      message: "Failed to generate prescription PDF",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Consultation By ID
|--------------------------------------------------------------------------
*/
const getConsultationById = async (req, res) => {
  try {
    const consultation =
      await getConsultationByIdService(
        req.params.id,
      );

    return res.status(200).json({
      success: true,

      data: consultation,
    });
  } catch (error) {
    console.error(
      "GET CONSULTATION BY ID ERROR:",
      error,
    );

    if (error.message === "Consultation not found") {
      return res.status(404).json({
        success: false,

        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,

      message: "Failed to fetch consultation",
    });
  }
};

module.exports = {
  createConsultation,
  getConsultationById,
  getConsultationByAppointment,
  updateConsultation,
  getConsultations,
  downloadPrescriptionPdf,
};