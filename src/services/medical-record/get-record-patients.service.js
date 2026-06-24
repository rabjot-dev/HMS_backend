const Appointment = require("../../models/Appointment");
const Patient = require("../../models/Patient");

const getRecordPatients = async ({ user, skip, limit, sort }) => {
  const filter = {
    isDeleted: { $ne: true },
  };

  if (user.roles?.includes("DOCTOR")) {
    const patientIds = await Appointment.distinct("patientId", {
      doctorEmployeeId: user.employeeId,
      isDeleted: { $ne: true },
    });

    filter._id = {
      $in: patientIds,
    };
  }

  const total = await Patient.countDocuments(filter);

  const patients = await Patient.find(filter)
    .select("firstName lastName patientId gender status createdAt")
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    patients,
    total,
  };
};

module.exports = getRecordPatients;
