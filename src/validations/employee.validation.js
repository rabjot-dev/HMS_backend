const { body } = require("express-validator");

const ROLES = require("../constants/roles");

const registerEmployeeValidation = [
  body("name").notEmpty().withMessage("Employee name is required"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("phone").notEmpty().withMessage("Phone number is required"),

  body("department").notEmpty().withMessage("Department is required"),

  body("designation").notEmpty().withMessage("Designation is required"),

  body("joiningDate").notEmpty().withMessage("Joining date is required"),

  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(Object.values(ROLES))
    .withMessage("Invalid employee role"),
];

module.exports = {
  registerEmployeeValidation,
};
