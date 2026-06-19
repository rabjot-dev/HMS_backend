const Employee = require("../../models/Employee");

const getDoctorsService =
  async () => {
    return Employee.find({
      designation: "DOCTOR",
      isDeleted: false,
    })
      .select(
        "name department specialization availability consultationFee"
      )
      .sort({
        name: 1,
      })
      .lean();
  };

module.exports =
  getDoctorsService;