const bcrypt = require("bcryptjs");

const Employee = require("../models/Employee");

const User = require("../models/User");

const STATUS = require("../constants/status");

const registerEmployee = require("../services/employee/register-employee.service");

const generateTemporaryPassword = require("../utils/generateTemporaryPassword");

//Create Employee
const createEmployee = async (req, res) => {
  try {
    const serviceResponse = await registerEmployee(req.body);
    return res.status(201).json({
      success: true,
      message: "Employee registered successfully",
      data: serviceResponse,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//Get All Employees
const getEmployees = async (req, res) => {
  const employees = await Employee.find();
  return res.status(200).json({
    success: true,
    data: employees,
  });
};

//Get Employee By ID
const getEmployeeById = async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  return res.status(200).json({
    success: true,
    data: employee,
  });
};

//Update Employee
const updateEmployee = async (req, res) => {
  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  return res.status(200).json({
    success: true,
    data: employee,
  });
};

//Deactivate Employee
const deactivateEmployee = async (req, res) => {
  const employeeId = req.params.id;
  await User.findOneAndUpdate(
    {
      employeeId,
    },
    {
      status: STATUS.INACTIVE,
    },
  );

  await Employee.findByIdAndUpdate(employeeId, {
    status: STATUS.INACTIVE,
  });

  return res.status(200).json({
    success: true,
    message: "Employee deactivated successfully",
  });
};

//Activate Employee
const activateEmployee = async (req, res) => {
  const employeeId = req.params.id;

  await User.findOneAndUpdate(
    {
      employeeId,
    },

    {
      status: STATUS.ACTIVE,
    },
  );

  await Employee.findByIdAndUpdate(
    employeeId,

    {
      status: STATUS.ACTIVE,
    },
  );

  return res.status(200).json({
    success: true,
    message: "Employee activated successfully",
  });
};

//Get Pending Employees
const getPendingEmployees = async (req, res) => {
  const employees = await Employee.find({
    status: STATUS.PENDING,
  });

  return res.status(200).json({
    success: true,
    data: employees,
  });
};

//Approve Employee
const approveEmployee = async (req, res) => {
  const employeeId = req.params.id;

  const user = await User.findOne({
    employeeId,
  });

  if (!user) {
    throw new Error("User not found");
  }

  //Update User Status
  user.status = STATUS.ACTIVE;
  await user.save();

  //Update Employee status also
  await Employee.findByIdAndUpdate(
    employeeId,

    {
      status: STATUS.ACTIVE,
    },
  );

  return res.status(200).json({
    success: true,
    message: "Employee approved successfully",
  });
};

//Reject Employee
const rejectEmployee = async (req, res) => {
  const employeeId = req.params.id;

  // Update User status
  await User.findOneAndUpdate(
    {
      employeeId,
    },

    {
      status: STATUS.REJECTED,
    },
  );

  //Also Update Employee status
  await Employee.findByIdAndUpdate(employeeId, {
    status: STATUS.REJECTED,
  });

  return res.status(200).json({
    success: true,
    message: "Employee rejected successfully",
  });
};

//Get Doctors
const getDoctors = async (req, res) => {
  try {
    const doctors = await Employee.find({
      designation: "DOCTOR",
    })
      .select("name department specialization availability consultationFee")
      .sort({
        name: 1,
      });

    return res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Update Doctor Availability

const updateDoctorAvailability = async (req, res) => {
  try {
    const user = await User.findById(req.user?.userId);
    const employeeId = user?.employeeId;
    const doctor = await Employee.findById(employeeId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    console.log("REQUEST BODY RECEIVED:", JSON.stringify(req.body, null, 2));

    const {
      workingDays,
      startTime,
      endTime,
      breakStartTime,
      breakEndTime,
      isAvailable,
    } = req.body;

    const slotDuration = Number(req.body.slotDuration);
    const maxPatientsPerDay = Number(req.body.maxPatientsPerDay);

    //Update Availability
    doctor.availability = {
      workingDays,
      startTime,
      endTime,
      slotDuration,
      breakStartTime,
      breakEndTime,
      maxPatientsPerDay,
      isAvailable,
    };

    doctor.markModified("availability");
    await doctor.save();

    return res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//Get Doctor Availability
const getDoctorAvailability = async (req, res) => {
  try {
    const user = await User.findById(req.user?.userId);

    const employeeId = user?.employeeId;

    //Find Doctor
    const doctor = await Employee.findById(employeeId);
    console.log(req.user);

    //Doctor Not Found

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: doctor?.availability,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deactivateEmployee,
  activateEmployee,
  getPendingEmployees,
  approveEmployee,
  rejectEmployee,

  getDoctors,
  updateDoctorAvailability,
  getDoctorAvailability,
};
