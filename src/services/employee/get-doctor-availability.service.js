const Employee = require("../../models/Employee");
const User = require("../../models/User");

const getDoctorAvailabilityService =
  async (userId) => {
    const user =
      await User.findOne({
        _id: userId,
        isDeleted: false,
      });

    if (!user) {
      throw new Error(
        "User account not found"
      );
    }

    const doctor =
      await Employee.findOne({
        _id: user.employeeId,
        isDeleted: false,
      });

    if (!doctor) {
      throw new Error(
        "Doctor not found"
      );
    }

    return doctor.availability;
  };

module.exports =
  getDoctorAvailabilityService;