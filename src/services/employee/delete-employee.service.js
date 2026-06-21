const Employee = require("../../models/Employee");
const User = require("../../models/User");
const STATUS = require("../../constants/status");
const ERR = require("../../utils/errors");

const deleteEmployeeService = async (employeeId, deletedBy) => {
  const employee = await Employee.findOne({
    _id: employeeId,
    isDeleted: { $ne: true },
  });

  if (!employee) {
    throw ERR.employeeNotFound();
  }

  employee.isDeleted = true;
  employee.deletedBy = deletedBy;
  employee.deletedDate = new Date();
  employee.status = STATUS.INACTIVE;

  await employee.save();

  await User.findOneAndUpdate(
    { employeeId },
    {
      status: STATUS.INACTIVE,
    }
  );

  return employee;
};

module.exports = deleteEmployeeService;

