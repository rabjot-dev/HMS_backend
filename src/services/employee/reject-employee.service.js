const Employee = require("../../models/Employee");
const User = require("../../models/User");
const STATUS = require("../../constants/status");

const rejectEmployeeService = async (
  employeeId,
  rejectedBy,
  rejectionReason = null,
) => {
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
    throw new Error("Employee account not found");
  }

  employee.status = STATUS.REJECTED;

  employee.rejectedBy = rejectedBy;

  employee.rejectedDate = new Date();

  employee.rejectionReason = rejectionReason;

  user.status = STATUS.REJECTED;

  await employee.save();
  await user.save();

  return employee;
};

module.exports = rejectEmployeeService;
