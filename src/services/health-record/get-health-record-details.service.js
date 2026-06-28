const mongoose = require("mongoose");

const Consultation = require("../../models/Consultation");
const Patient = require("../../models/Patient");

const ROLES = require("../../constants/roles");
const ApiError = require("../../utils/ApiError");

const getHealthRecordDetailsService = async (patientId, user, query) => {


  const limit = Math.min(Math.max(Number(query.limit) || 5, 1), 10000);

  const timelinePage = Math.max(Number(query.timelinePage) || 1, 1);

  const labPage = Math.max(Number(query.labPage) || 1, 1);

  const documentPage = Math.max(Number(query.documentPage) || 1, 1);


  const patient = await Patient.findOne({
    _id: patientId,
    isDeleted: false,
  })
    .select(
      `
        patientId
        firstName
        lastName
        gender
        bloodGroup
        phone
        dateOfBirth
        allergies
        chronicDiseases
        currentMedications
        medicalHistory
        labReports
        medicalDocuments
      `,
    )
    .lean();

  if (!patient) {
    throw new ApiError(404, "Patient not found", "PATIENT_NOT_FOUND");
  }


  if (user.roles?.includes(ROLES.DOCTOR)) {
    const hasAccess = await Consultation.exists({
      patientId,
      doctorEmployeeId: user.employeeId,
      isDeleted: false,
    });

    if (!hasAccess) {
      throw new ApiError(403, "Access denied", "ACCESS_DENIED");
    }
  }



  const filter = {
    patientId,
    isDeleted: false,
  };

  if (user.roles?.includes(ROLES.DOCTOR)) {
    filter.doctorEmployeeId = new mongoose.Types.ObjectId(user.employeeId);
  }


  const totalConsultations = await Consultation.countDocuments(filter);

  const consultations = await Consultation.find(filter)
    .populate({
      path: "doctorEmployeeId",

      select: `
          name
          department
          specialization
        `,

      match: {
        isDeleted: false,
      },
    })
    .select(
      `
        appointmentId
        patientId
        doctorEmployeeId
        diagnosis
        symptoms
        doctorNotes
        vitals
        prescriptions
        status
        createdAt
        updatedAt
      `,
    )
    .sort({
      createdAt: -1,
    })
    .skip((timelinePage - 1) * limit)
    .limit(limit)
    .lean();

  /*
  |--------------------------------------------------------------------------
  | Lab Reports Pagination
  |--------------------------------------------------------------------------
  */

  const getSortableTime = (value, fallback) => {
    const timestamp = new Date(value || fallback || 0).getTime();

    return Number.isNaN(timestamp) ? 0 : timestamp;
  };

  const labReports = (
    patient.labReports?.filter((report) => !report.isDeleted) ?? []
  ).sort(
    (a, b) =>
      getSortableTime(b.reportDate, b.createdAt) -
      getSortableTime(a.reportDate, a.createdAt),
  );

  const paginatedLabReports = labReports.slice(
    (labPage - 1) * limit,
    labPage * limit,
  );

  /*
  |--------------------------------------------------------------------------
  | Medical Documents Pagination
  |--------------------------------------------------------------------------
  */

  const medicalDocuments = (
    patient.medicalDocuments?.filter((document) => !document.isDeleted) ?? []
  ).sort(
    (a, b) =>
      getSortableTime(b.recordDate, b.createdAt) -
      getSortableTime(a.recordDate, a.createdAt),
  );

  const consultationTotalPages = Math.max(Math.ceil(totalConsultations / limit), 1);
  const labTotalPages = Math.max(Math.ceil(labReports.length / limit), 1);
  const documentTotalPages = Math.max(Math.ceil(medicalDocuments.length / limit), 1);
  const paginatedMedicalDocuments = medicalDocuments.slice(
    (documentPage - 1) * limit,
    documentPage * limit,
  );

  /*
  |--------------------------------------------------------------------------
  | Response
  |--------------------------------------------------------------------------
  */

  return {
    patient,
    consultations,
    labReports: paginatedLabReports,
    medicalDocuments: paginatedMedicalDocuments,

    meta: {
      consultations: {
        page: timelinePage,
        limit,
        totalRecords: totalConsultations,
        totalPages: consultationTotalPages,
      },

      labReports: {
        page: labPage,
        limit,
        totalRecords: labReports.length,
        totalPages: labTotalPages,
      },

      medicalDocuments: {
        page: documentPage,
        limit,
        totalRecords: medicalDocuments.length,
        totalPages: documentTotalPages,
      },
    },
  };
};

module.exports = getHealthRecordDetailsService;
