const bcrypt = require("bcryptjs");
const User = require("../models/User");
const crypto = require("crypto");
const sendEmail = require("../utils/mailer");
const generateEmployeeCode = require("../utils/generateEmployeeCode");
const Employee = require("../models/Employee");

exports.createEmployeeByAdmin = async (req, res) => {
  try {
    const { name, email, phone, department, designation, role } = req.body;

    if (!name || !email || !phone || !department || !designation) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Employee already exists with this email",
      });
    }

    const temporaryPassword = crypto.randomBytes(5).toString("hex");

    const password_hash = await bcrypt.hash(temporaryPassword, 10);

    const employeeCode = await generateEmployeeCode();

    const employee = await User.create({
      name,
      employeeCode,
      email,
      phone,
      department,
      designation,
      role: role || "EMPLOYEE",
      password_hash,
      temporaryPassword,
      isFirstLogin: true,
      status: "ACTIVE",
    });
    await Employee.create({
  employeeCode,
  name,
  email,
  phone,
  department,
  designation,
  role: role || "EMPLOYEE",
  status: "ACTIVE",
  userId: employee._id,
});

    await sendEmail({
      to: email,
      subject: "HMS Employee Account Created",
      html: `
        <h2>Welcome to HMS</h2>

        <p>Your employee account has been created successfully.</p>

        <p><strong>Employee Code:</strong> ${employeeCode}</p>

        <p><strong>Email:</strong> ${email}</p>

        <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>

        <p>
          Please login using this temporary password and reset your password immediately.
        </p>
      `,
    });

    return res.status(201).json({
      success: true,
      message:
        "Employee created successfully. Temporary password sent through email.",
      data: employee,
    });
  } catch (error) {
    console.log("CREATE EMPLOYEE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating employee",
    });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({
      role: { $ne: "ADMIN" },
    }).select("-password_hash -temporaryPassword");

    return res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    console.log("GET EMPLOYEES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching employees",
    });
  }
};