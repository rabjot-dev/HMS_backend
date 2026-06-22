const Consultation =
  require("../../models/consultation");

const Patient =
  require("../../models/Patient");

const ROLES =
  require("../../constants/roles");

const ApiError =
  require("../../utils/ApiError");

const getHealthRecordDetailsService =
  async (
    patientId,
    user
  ) => {
    /*
    |--------------------------------------------------------------------------
    | Patient
    |--------------------------------------------------------------------------
    */

    const patient =
      await Patient.findOne({
        _id: patientId,
        isDeleted: false,
      })
        .select(`
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
`)
        .lean();

    if (!patient) {
      throw new ApiError(
        404,
        "Patient not found",
        "PATIENT_NOT_FOUND"
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Consultation Filter
    |--------------------------------------------------------------------------
    */

    const filter = {
      patientId,
      isDeleted: false,
    };

    /*
    |--------------------------------------------------------------------------
    | Doctor Visibility
    |--------------------------------------------------------------------------
    */

    if (
      user.roles?.includes(
        ROLES.DOCTOR
      )
    ) {
      filter.doctorEmployeeId =
        user.employeeId;
    }

    /*
    |--------------------------------------------------------------------------
    | Timeline
    |--------------------------------------------------------------------------
    */

    const consultations =
      await Consultation.find(
        filter
      )
        .populate({
          path:
            "doctorEmployeeId",

          select:
            `
            name
            department
            specialization
          `,

          match: {
            isDeleted:
              false,
          },
        })
      .select(`
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
`)
        .sort({
          createdAt: -1,
        })
        .lean();

    return {
  patient,
  consultations,
  labReports:
    patient.labReports ?? [],
  medicalDocuments:
    patient.medicalDocuments ?? [],
};
  };

module.exports =
  getHealthRecordDetailsService;