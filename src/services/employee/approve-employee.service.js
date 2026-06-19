const Employee = require("../../models/Employee");
const User = require("../../models/User");
const STATUS = require("../../constants/status");

const approveEmployeeService = async (
  employeeId,
  consultationFee,
  approvedBy
) => {
  const user = await User.findOne({
    employeeId,
    isDeleted: false,
  });

  if (!user) {
    throw new Error(
      "Employee account not found"
    );
  }

  const employee =
    await Employee.findOne({
      _id: employeeId,
      isDeleted: false,
    });

  if (!employee) {
    throw new Error("Employee not found");
  }

  if (
    employee.designation ===
      "DOCTOR" &&
    !consultationFee
  ) {
    throw new Error(
      "Consultation fee is required for doctors"
    );
  }

  if (
    employee.designation ===
    "DOCTOR"
  ) {
    employee.consultationFee =
      Number(consultationFee);
  }

  employee.status = STATUS.ACTIVE;
  employee.approvedBy = approvedBy;
  employee.approvalDate =
    new Date();

  employee.rejectedBy = null;
  employee.rejectedDate = null;
  employee.rejectionReason =
    null;

  user.status = STATUS.ACTIVE;

  await employee.save();
  await user.save();

  return employee;
};

module.exports =
  approveEmployeeService;