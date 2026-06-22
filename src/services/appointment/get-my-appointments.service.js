const Appointment = require("../../models/Appointment");

const getMyAppointments = async (patientId) => {
  return Appointment.find({
    patientId,
    isDeleted: false,
  })
    .populate({
      path: "doctorEmployeeId",

      select: "name department specialization",

      match: {
        isDeleted: false,
      },
    })
    .sort({
      appointmentDate: -1,
    });
};

module.exports = getMyAppointments;
