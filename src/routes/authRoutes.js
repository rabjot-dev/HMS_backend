// routes/authRoutes.js

const express = require("express");
const router = express.Router();

const { body } = require("express-validator");

const validate = require("../middleware/validate");

const { signup, login } = require("../controller/authController");

// SIGNUP VALIDATION

const signupValidation = [
  body("name").notEmpty().withMessage("Name is required"),

  body("email").isEmail().withMessage("Valid email is required"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  body("roles")
    .isIn([
      "OWNER",
      "ADMIN",
      "DOCTOR",
      "RECEPTIONIST",
      "CASHIER",
      "NURSE",
      "LAB_TECH",
      "PHARMACIST",
    ])
    .withMessage("Invalid role"),

  body("phone").notEmpty().withMessage("Phone number is required"),

  body("department").notEmpty().withMessage("Department is required"),

  body("designation").notEmpty().withMessage("Designation is required"),

  body("joiningDate").notEmpty().withMessage("Joining date is required"),

  body("specialization")
    .optional()
    .notEmpty()
    .withMessage("Specialization cannot be empty"),

  body("qualification")
    .optional()
    .isArray()
    .withMessage("Qualification must be an array"),

  body("availabilitySlots")
    .optional()
    .isArray()
    .withMessage("Availability slots must be an array"),
];

// LOGIN VALIDATION

const loginValidation = [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({min : 8}).withMessage("password must be atleast 8 characters")
];

router.post("/signup", signup);

module.exports = router;
