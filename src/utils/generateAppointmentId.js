const Appointment = require("../models/Appointment");

const generateAppointmentId = async () => {
  //Current Date
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");

  //Prefix
  const prefix = `APT-${year}${month}`;

  //Latest Appointment
  const latestAppointment = await Appointment.findOne({
    appointmentId: {
      $regex: `^${prefix}`,
    },
  })

    .sort({
      appointmentId: -1,
    });

  let sequence = 1;

  //Increment Sequence
  if (latestAppointment) {
    const lastSequence = parseInt(latestAppointment.appointmentId.slice(-5));
    sequence = lastSequence + 1;
  }

  //Final Appointment ID
  return `${prefix}${String(sequence).padStart(5, "0")}`;
};

module.exports = generateAppointmentId;
