const Appointment = require("../../models/Appointment");
const Patient = require("../../models/Patient");

const getDoctorStatsService = async () => {
  const totalAppointments = await Appointment.countDocuments();

  const completedAppointments =
    await Appointment.countDocuments({
      status: "COMPLETED",
    });

  const pendingAppointments =
    await Appointment.countDocuments({
      status: "BOOKED",
    });

  const totalPatients =
    await Patient.countDocuments();

  return {
    totalAppointments,
    completedAppointments,
    pendingAppointments,
    totalPatients,
  };
};

module.exports = getDoctorStatsService;