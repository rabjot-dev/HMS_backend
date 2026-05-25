const User = require("../models/User");
const EmployeeSignupRequest = require("../models/EmployeeSignupRequest");
const generateEmployeeCode = require("../utils/generateEmployeeCode");
const Employee = require("../models/Employee");

exports.getAllSignupRequests = async (req, res) => {
  try {
    const requests = await EmployeeSignupRequest.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching requests",
    });
  }
};

exports.getPendingSignupRequests = async (req, res) => {
  try {
    const requests = await EmployeeSignupRequest.find({
      status: "PENDING",
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching pending requests",
    });
  }
};

exports.approveSignupRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await EmployeeSignupRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Signup request not found",
      });
    }

    if (request.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "This request is already processed",
      });
    }

    const existingUser = await User.findOne({ email: request.email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const employeeCode = await generateEmployeeCode();

    const user = await User.create({
      name: request.name,
      employeeCode,
      email: request.email,
      phone: request.phone,
      password_hash: request.password_hash,
role: request.role,
      department: request.department,
      designation: request.designation,
      status: "ACTIVE",
      isFirstLogin: false,
      temporaryPassword: "",
    });

    await Employee.create({
  employeeCode,
  name: request.name,
  email: request.email,
  phone: request.phone,
  department: request.department,
  designation: request.designation,
role: request.role,
  status: "ACTIVE",
  userId: user._id,
});

    request.status = "APPROVED";
    await request.save();

    return res.status(200).json({
      success: true,
      message: "Employee registration approved successfully",
      data: user,
    });
  } catch (error) {
    console.error("APPROVE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while approving request",
    });
  }
};

exports.rejectSignupRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    const request = await EmployeeSignupRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Signup request not found",
      });
    }

    if (request.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "This request is already processed",
      });
    }

    request.status = "REJECTED";
    request.rejectionReason = rejectionReason || "Rejected by admin";

    await request.save();

    return res.status(200).json({
      success: true,
      message: "Employee registration rejected",
      data: request,
    });
  } catch (error) {
    console.error("REJECT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while rejecting request",
    });
  }
};