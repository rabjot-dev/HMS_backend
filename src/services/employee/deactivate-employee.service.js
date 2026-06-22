const Employee = require("../../models/Employee");
const User = require("../../models/User");
const STATUS = require("../../constants/status");

const deactivateEmployeeService = async (employeeId, userId) => {
  const employee = await Employee.findOne({
    _id: employeeId,
    isDeleted: false,
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  const user = await User.findOne({
    employeeId,
    isDeleted: false,
  });

  if (!user) {
    throw new Error("User account not found");
  }

  employee.status = STATUS.INACTIVE;
  employee.updatedBy = userId;

  user.status = STATUS.INACTIVE;

  await employee.save();
  await user.save();

  return employee;
};

module.exports = deactivateEmployeeService;
