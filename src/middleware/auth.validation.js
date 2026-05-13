const { body } = require("express-validator");

const loginValidation = [
  body("loginId")
    .notEmpty()
    .withMessage("Email/EmpId is required"),


  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

const createPasswordValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage(
      "Password must be at least 8 characters long",
    ),
];

const patientSignupValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage(
      "Password must be at least 8 characters long",
    ),

  body("phone")
    .notEmpty()
    .withMessage("Phone number is required"),

  body("gender")
    .notEmpty()
    .withMessage("Gender is required"),

  body("dob")
    .notEmpty()
    .withMessage("Date of birth is required"),

  body("address")
    .notEmpty()
    .withMessage("Address is required"),
];

module.exports = {
  loginValidation,
  createPasswordValidation,
  patientSignupValidation,
};