const Employee = require("../../models/Employee");
const User = require("../../models/User");

const updateDoctorAvailabilityService = async (
  userId,
  availabilityData,
  updatedBy,
) => {
  const user = await User.findOne({
    _id: userId,
    isDeleted: false,
  });

  if (!user) {
    throw new Error("User account not found");
  }

  const doctor = await Employee.findOne({
    _id: user.employeeId,
    isDeleted: false,
  });

  if (!doctor) {
    throw new Error("Doctor not found");
  }

  doctor.availability = availabilityData;

  doctor.updatedBy = updatedBy;

  await doctor.save();

  return doctor;
};

module.exports = updateDoctorAvailabilityService;
