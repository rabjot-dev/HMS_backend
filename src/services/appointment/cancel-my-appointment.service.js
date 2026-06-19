const Appointment =
  require("../../models/Appointment");

const STATUS =
  require("../../constants/status");

const cancelMyAppointment =
  async (
    appointmentId,
    patientId
  ) => {
    const appointment =
      await Appointment.findOne({
        _id:
          appointmentId,

        patientId,

        isDeleted: false,
      });

    if (!appointment) {
      throw new Error(
        "Appointment not found"
      );
    }

    if (
      [
        STATUS.COMPLETED,
        STATUS.REJECTED,
        STATUS.NO_SHOW,
        STATUS.IN_CONSULTATION,
        STATUS.CANCELLED,
      ].includes(
        appointment.status
      )
    ) {
      throw new Error(
        "Appointment cannot be cancelled"
      );
    }

    appointment.status =
      STATUS.CANCELLED;

    await appointment.save();

    return appointment;
  };

module.exports =
  cancelMyAppointment;