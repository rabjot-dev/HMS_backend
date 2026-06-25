const Consultation = require("../../models/consultation");

const Appointment = require("../../models/Appointment");

const STATUS = require("../../constants/status");

const createConsultationService = async (data, createdBy) => {
  const {
    appointmentId,
    diagnosis,
    symptoms,
    doctorNotes,
    vitals,
    prescriptions,
  } = data;

  const existingConsultation = await Consultation.findOne({
    appointmentId,
    isDeleted: false,
  });

  if (existingConsultation) {
    throw new Error("Consultation already exists");
  }

  const appointment = await Appointment.findOne({
    _id: appointmentId,

    isDeleted: false,
  });

  if (!appointment) {
    throw new Error("Appointment not found");
  }

const consultation = await Consultation.create({
    appointmentId,
    patientId: appointment.patientId,
    doctorEmployeeId: appointment.doctorEmployeeId,

    diagnosis,
    symptoms,
    doctorNotes,
    vitals,
    prescriptions,

    status: STATUS.COMPLETED,

    createdBy,
      updatedBy: createdBy,
});
  appointment.status = STATUS.COMPLETED;

  appointment.updatedBy = createdBy;

  await appointment.save();

  return consultation;
};

module.exports = createConsultationService;
