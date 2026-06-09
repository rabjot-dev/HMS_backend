const mongoose = require("mongoose");

const Employee = require("../models/Employee");

const User = require("../models/User");

const STATUS = require("../constants/status");

const registerEmployee = require("../services/employee/register-employee.service");
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
    console.error("CREATE EMPLOYEE ERROR:", error);

    if (error.message === "Employee already exists with this phone number") {
      return res.status(409).json({
        success: false,
        message: "Employee already exists with this phone number",
      });
    }

    if (error.message === "Employee already exists with this email") {
      return res.status(409).json({
        success: false,
        message: "Employee already exists with this email",
      });
    }
    if ( error.message === "Employee already exists with this medical registration number") {
  return res.status(409).json({
    success: false,
    message: error.message,
  });
}

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate record found",
      });
    }

    return res.status(500).json({
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
  try {
    const employees = await Employee.find();

    return res.status(200).json({
      success: true,
      message: "Employees retrieved successfully",
      data: employees,
    });
  } catch (error) {
    console.error("GET EMPLOYEES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve employees",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Employee By ID
|--------------------------------------------------------------------------
*/
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID",
      });
    }

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee retrieved successfully",
      data: employee,
    });
  } catch (error) {
    console.error("GET EMPLOYEE BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve employee",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Update Employee
|--------------------------------------------------------------------------
*/
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID",
      });
    }

    const { email, employeeCode, ...updateData } = req.body;
    if (req.body.medicalRegistrationNo) {
      const existingDoctor = await Employee.findOne({
        medicalRegistrationNo: req.body.medicalRegistrationNo,
        _id: { $ne: id },
      });

      if (existingDoctor) {
        return res.status(409).json({
          success: false,
          message: "Medical registration number already exists",
        });
      }
    }

    const employee = await Employee.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    console.error("UPDATE EMPLOYEE ERROR:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === "Medical registration number already exists") {
      return res.status(409).json({
        success: false,
        message: "Medical registration number already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update employee",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Deactivate Employee
|--------------------------------------------------------------------------
*/
const deactivateEmployee = async (req, res) => {
  try {
    const { id: employeeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID",
      });
    }

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    await User.findOneAndUpdate({ employeeId }, { status: STATUS.INACTIVE });

    await Employee.findByIdAndUpdate(employeeId, { status: STATUS.INACTIVE });

    return res.status(200).json({
      success: true,
      message: "Employee deactivated successfully",
    });
  } catch (error) {
    console.error("DEACTIVATE EMPLOYEE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to deactivate employee",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Activate Employee
|--------------------------------------------------------------------------
*/
const activateEmployee = async (req, res) => {
  try {
    const { id: employeeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID",
      });
    }

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    await User.findOneAndUpdate({ employeeId }, { status: STATUS.ACTIVE });

    await Employee.findByIdAndUpdate(employeeId, { status: STATUS.ACTIVE });

    return res.status(200).json({
      success: true,
      message: "Employee activated successfully",
    });
  } catch (error) {
    console.error("ACTIVATE EMPLOYEE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to activate employee",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Pending Employees
|--------------------------------------------------------------------------
*/
const getPendingEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({
      status: STATUS.PENDING,
    });

    return res.status(200).json({
      success: true,
      message: "Pending employees retrieved successfully",
      data: employees,
    });
  } catch (error) {
    console.error("GET PENDING EMPLOYEES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve pending employees",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Approve Employee
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| Approve Employee
|--------------------------------------------------------------------------
*/
const approveEmployee = async (req, res) => {
  try {
    const { id: employeeId } = req.params;

    const { consultationFee } = req.body;

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID",
      });
    }

    const user = await User.findOne({
      employeeId,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Employee account not found",
      });
    }

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Doctor Consultation Fee Validation
    |--------------------------------------------------------------------------
    */
    if (
      employee.designation === "DOCTOR" &&
      (consultationFee === undefined ||
        consultationFee === null ||
        consultationFee === "")
    ) {
      return res.status(400).json({
        success: false,
        message: "Consultation fee is required for doctors",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Set Consultation Fee
    |--------------------------------------------------------------------------
    */
    if (employee.designation === "DOCTOR") {
      employee.consultationFee = Number(consultationFee);
    }

    /*
    |--------------------------------------------------------------------------
    | Activate Employee
    |--------------------------------------------------------------------------
    */
    employee.status = STATUS.ACTIVE;

    await employee.save();

    user.status = STATUS.ACTIVE;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Employee approved successfully",
      data: employee,
    });
  } catch (error) {
    console.error("APPROVE EMPLOYEE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to approve employee",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Reject Employee
|--------------------------------------------------------------------------
*/
const rejectEmployee = async (req, res) => {
  try {
    const { id: employeeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID",
      });
    }

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    await User.findOneAndUpdate({ employeeId }, { status: STATUS.REJECTED });

    await Employee.findByIdAndUpdate(employeeId, {
      status: STATUS.REJECTED,
    });

    return res.status(200).json({
      success: true,
      message: "Employee rejected successfully",
    });
  } catch (error) {
    console.error("REJECT EMPLOYEE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject employee",
    });
  }
};
/*
|--------------------------------------------------------------------------
| Get Doctors
|--------------------------------------------------------------------------
*/
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
      message: "Doctors retrieved successfully",
      data: doctors,
    });
  } catch (error) {
    console.error("GET DOCTORS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve doctors",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Update Doctor Availability
|--------------------------------------------------------------------------
*/
const updateDoctorAvailability = async (req, res) => {
  try {
    /*
    |--------------------------------------------------------------------------
    | Find Logged In User
    |--------------------------------------------------------------------------
    */
    const user = await User.findById(req.user?.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Employee ID
    |--------------------------------------------------------------------------
    */
    const employeeId = user.employeeId;

    /*
    |--------------------------------------------------------------------------
    | Find Doctor
    |--------------------------------------------------------------------------
    */
    const doctor = await Employee.findById(employeeId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Request Body
    |--------------------------------------------------------------------------
    */
    const {
      workingDays,
      startTime,
      endTime,
      slotDuration,
      breakStartTime,
      breakEndTime,
      maxPatientsPerDay,
      isAvailable,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Update Availability
    |--------------------------------------------------------------------------
    */
   await Employee.findByIdAndUpdate(
  employeeId,
  {
    $set: {
      availability: {
        workingDays,
        startTime,
        endTime,
        slotDuration,
        breakStartTime,
        breakEndTime,
        maxPatientsPerDay,
        isAvailable,
      },
    },
  },
  { new: true }
);
    await doctor.save();
    const updatedDoctor =
  await Employee.findById(employeeId);

console.log(
  "SAVED AVAILABILITY =>",
  updatedDoctor.availability
);

    return res.status(200).json({
      success: true,
      message: "Doctor availability updated successfully",
      data: doctor,
    });
  } catch (error) {
    console.error("UPDATE DOCTOR AVAILABILITY ERROR:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update doctor availability",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Doctor Availability
|--------------------------------------------------------------------------
*/
const getDoctorAvailability = async (req, res) => {
  try {
    /*
    |--------------------------------------------------------------------------
    | Find Logged In User
    |--------------------------------------------------------------------------
    */
    const user = await User.findById(req.user?.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Employee ID
    |--------------------------------------------------------------------------
    */
    const employeeId = user.employeeId;

    /*
    |--------------------------------------------------------------------------
    | Find Doctor
    |--------------------------------------------------------------------------
    */
    const doctor = await Employee.findById(employeeId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor availability retrieved successfully",
      data: doctor.availability,
    });
  } catch (error) {
    console.error("GET DOCTOR AVAILABILITY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve doctor availability",
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
