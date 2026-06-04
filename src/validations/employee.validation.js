const { body } = require("express-validator");
const ROLES = require("../constants/roles");

const registerEmployeeValidation = [
  // NAME
  body("name")
    .notEmpty()
    .withMessage("Employee name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name must contain only alphabets")
    .trim(),

  // EMAIL
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  // PHONE
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[0-9]{10}$/)
    .withMessage("Phone number must be exactly 10 digits"),

  // GENDER
  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["MALE", "FEMALE", "OTHER"])
    .withMessage("Invalid gender value"),

  // DEPARTMENT
  body("department").notEmpty().withMessage("Department is required").trim(),

  // DESIGNATION
  body("designation")
    .notEmpty()
    .withMessage("Designation is required")
    .isString(),

  // JOINING DATE
  body("joiningDate")
    .notEmpty()
    .withMessage("Joining date is required")
    .isISO8601()
    .withMessage("Invalid date format (use YYYY-MM-DD)"),

  // ROLE
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(Object.values(ROLES))
    .withMessage("Invalid employee role"),
];

module.exports = { registerEmployeeValidation };
