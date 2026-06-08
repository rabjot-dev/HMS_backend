const Appointment = require("../../models/Appointment");

const getTodayAppointmentsService = async () => {
  return Appointment.find()
    .populate("patientId")
    .sort({
      createdAt: -1,
    })
    .limit(5);
};

module.exports = getTodayAppointmentsService;