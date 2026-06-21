const Employee = require("../../models/Employee");
const User = require("../../models/User");
const ERR = require("../../utils/errors");

const updateDoctorAvailabilityService = async (userId, availabilityData) => {
  const user = await User.findById(userId);

  if (!user) {
throw ERR.userAccountNotFound();
  }
  const doctor = await Employee.findByIdAndUpdate(
    user.employeeId,
    {
      $set: {
        availability: availabilityData,
      },
    },
    {
      returnDocument: "after",
    },
  );

  if (!doctor) {
throw ERR.doctorNotFound();
  }
  return doctor;
};

module.exports = updateDoctorAvailabilityService;
