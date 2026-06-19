const Employee = require("../../models/Employee");

const getEmployeesService =
  async () => {
    return Employee.find({
      isDeleted: false,
    }).sort({
      createdAt: -1,
    });
  };

module.exports =
  getEmployeesService;