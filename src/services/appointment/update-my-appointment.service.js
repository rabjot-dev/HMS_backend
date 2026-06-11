const Appointment =
require("../../models/Appointment");

const updateMyAppointment =
async (
  appointmentId,
  patientId,
  updateData
) => {

  const appointment =
    await Appointment.findOne({

      _id:
        appointmentId,

      patientId,
    });

  if (!appointment) {

    throw new Error(
      "Appointment not found"
    );
  }

  if (
    appointment.status !==
    "PENDING"
  ) {

    throw new Error(
      "Appointment can no longer be modified"
    );
  }

  const {
    doctorId,
    appointmentDate,
    appointmentTime,
    symptoms,
    notes,
    reason,
  } = updateData;

  if (
    doctorId
  ) {

    appointment.doctorEmployeeId =
      doctorId;
  }

  if (
    appointmentDate
  ) {

    appointment.appointmentDate =
      appointmentDate;
  }

  if (
    appointmentTime
  ) {

    appointment.timeSlot =
      appointmentTime;
  }

  if (
    symptoms
  ) {

    appointment.symptoms =
      symptoms;
  }

  if (
    notes
  ) {

    appointment.notes =
      notes;
  }

  if (
    reason
  ) {

    appointment.reason =
      reason;
  }

  await appointment.save();

  return appointment;
};

module.exports =
  updateMyAppointment;