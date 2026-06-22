const Employee = require("../../models/Employee");

const updateEmployeeService = async (employeeId, updateData, updatedBy) => {
  if (updateData.medicalRegistrationNo) {
    const existingDoctor = await Employee.findOne({
      medicalRegistrationNo: updateData.medicalRegistrationNo,

      _id: {
        $ne: employeeId,
      },

      isDeleted: false,
    });

    if (existingDoctor) {
      throw new Error("Medical registration number already exists");
    }
  }

  const employee = await Employee.findOne({
    _id: employeeId,
    isDeleted: false,
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  Object.assign(employee, updateData);

  employee.updatedBy = updatedBy;

  await employee.save();

  return employee;
};

module.exports = updateEmployeeService;
