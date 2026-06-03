const Employee = require("../models/Employee");

const Appointment = require("../models/Appointment");

const Patient = require("../models/Patient");

const STATUS = require("../constants/status");

//Admin Stats
const getAdminStats = async (req, res) => {
  const totalEmployees = await Employee.countDocuments();

  const totalDoctors = await Employee.countDocuments({
    designation: "DOCTOR",
  });

  const totalNurses = await Employee.countDocuments({
    designation: "NURSE",
  });

  const pendingRequests = await Employee.countDocuments({
    status: STATUS.PENDING,
  });

  return res.status(200).json({
    success: true,
    data: {
      totalEmployees,
      totalDoctors,
      totalNurses,
      pendingRequests,
    },
  });
};

//Recent Employees
const getRecentEmployees = async (req, res) => {
  const employees = await Employee.find()

    .sort({
      createdAt: -1,
    })
    .limit(5);

  return res.status(200).json({
    success: true,
    data: employees,
  });
};

//Doctor Stats
const getDoctorStats = async (req, res) => {
  const totalAppointments = await Appointment.countDocuments();

  const completedAppointments = await Appointment.countDocuments({
    status: "COMPLETED",
  });

  const pendingAppointments = await Appointment.countDocuments({
    status: "BOOKED",
  });

  const totalPatients = await Patient.countDocuments();

  return res.status(200).json({
    success: true,
    data: {
      totalAppointments,
      completedAppointments,
      pendingAppointments,
      totalPatients,
    },
  });
};

//Receptionist Stats
const getReceptionistStats = async (req, res) => {
  const todayAppointments = await Appointment.countDocuments();
  const totalPatients = await Patient.countDocuments();
  const checkedInPatients = await Appointment.countDocuments({
    status: "IN_CONSULTATION",
  });

  const pendingAppointments = await Appointment.countDocuments({
    status: "BOOKED",
  });

  return res.status(200).json({
    success: true,
    data: {
      todayAppointments,
      totalPatients,
      checkedInPatients,
      pendingAppointments,
    },
  });
};

//Today Appointments
const getTodayAppointments = async (req, res) => {
  const appointments = await Appointment.find()

    .populate("patientId")
    .sort({
      createdAt: -1,
    })
    .limit(5);

  return res.status(200).json({
    success: true,
    data: appointments,
  });
};

module.exports = {
  getAdminStats,
  getRecentEmployees,
  getDoctorStats,
  getReceptionistStats,
  getTodayAppointments,
};
