const bcrypt = require("bcryptjs");

const Employee = require("../models/Employee");

const User = require("../models/User");

const STATUS = require("../constants/status");

const registerEmployee = require("../services/employee/register-employee.service");

const generateTemporaryPassword = require("../utils/generateTemporaryPassword");

/*
|--------------------------------------------------------------------------
| Create Employee
|--------------------------------------------------------------------------
*/
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

/*
|--------------------------------------------------------------------------
| Get All Employees
|--------------------------------------------------------------------------
*/
const getEmployees = async (req, res) => {
  const employees = await Employee.find();

  return res.status(200).json({
    success: true,

    data: employees,
  });
};

/*
|--------------------------------------------------------------------------
| Get Employee By ID
|--------------------------------------------------------------------------
*/
const getEmployeeById = async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  return res.status(200).json({
    success: true,

    data: employee,
  });
};

/*
|--------------------------------------------------------------------------
| Update Employee
|--------------------------------------------------------------------------
*/
const updateEmployee = async (req, res) => {
  const employee = await Employee.findByIdAndUpdate(
    req.params.id,

    req.body,

    {
      new: true,
    },
  );

  return res.status(200).json({
    success: true,

    data: employee,
  });
};


module.exports = {
  createEmployee,

  getEmployees,

  getEmployeeById,

  updateEmployee,
};
