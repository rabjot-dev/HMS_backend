const Employee = require("../../models/Employee");

const getEmployeeByIdService = async (id) => {
  const employee = await Employee.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  return employee;
};

module.exports = getEmployeeByIdService;
