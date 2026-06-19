const Employee =
  require("../../models/Employee");

const User =
  require("../../models/User");

const deleteEmployeeService =
  async (
    employeeId,
    deletedBy
  ) => {
    const employee =
      await Employee.findOne({
        _id: employeeId,
        isDeleted: false,
      });

    if (!employee) {
      throw new Error(
        "Employee not found"
      );
    }

    employee.isDeleted = true;
    employee.deletedBy =
      deletedBy;
    employee.deletedAt =
      new Date();

    await employee.save();

    await User.findOneAndUpdate(
      {
        employeeId,
        isDeleted: false,
      },
      {
        isDeleted: true,
        deletedBy,
        deletedAt:
          new Date(),
      }
    );

    return {
      message:
        "Employee deleted successfully",
    };
  };

module.exports =
  deleteEmployeeService;