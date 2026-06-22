const getNextTokenNumber = async (doctorEmployeeId, appointmentDate) => {
  const { startOfDay, endOfDay } = getDateRange(appointmentDate);

  const latestAppointment = await Appointment.findOne({
    doctorEmployeeId,
    isDeleted: { $ne: true },
    appointmentDate: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
    tokenNumber: {
      $ne: null,
    },
    status: {
      $nin: ["CANCELLED", "NO_SHOW", "REJECTED"],
    },
  }).sort({ tokenNumber: -1 });

  return (latestAppointment?.tokenNumber || 0) + 1;
};
