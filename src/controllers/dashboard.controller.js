const getAdminStatsService = require("../services/dashboard/get-admin-stats.service");

const getRecentEmployeesService = require("../services/dashboard/get-recent-employees.service");

const getDoctorStatsService = require("../services/dashboard/get-doctor-stats.service");

const getReceptionistStatsService = require("../services/dashboard/get-receptionist-stats.service");

const getTodayAppointmentsService = require("../services/dashboard/get-today-appointments.service");

/*
|--------------------------------------------------------------------------
| Admin Stats
|--------------------------------------------------------------------------
*/
const getAdminStats = async (req, res) => {
  try {
    const stats = await getAdminStatsService();

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("GET ADMIN STATS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard statistics",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Recent Employees
|--------------------------------------------------------------------------
*/
const getRecentEmployees = async (req, res) => {
  try {
    const employees =
      await getRecentEmployeesService();

    return res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    console.error("GET RECENT EMPLOYEES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent employees",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Doctor Stats
|--------------------------------------------------------------------------
*/
const getDoctorStats = async (req, res) => {
  try {
    const stats = await getDoctorStatsService();

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("GET DOCTOR STATS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctor dashboard statistics",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Receptionist Stats
|--------------------------------------------------------------------------
*/
const getReceptionistStats = async (req, res) => {
  try {
    const stats =
      await getReceptionistStatsService();

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error(
      "GET RECEPTIONIST STATS ERROR:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch receptionist dashboard statistics",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Today Appointments
|--------------------------------------------------------------------------
*/
const getTodayAppointments = async (req, res) => {
  try {
    const appointments =
      await getTodayAppointmentsService();

    return res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error(
      "GET TODAY APPOINTMENTS ERROR:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
    });
  }
};

module.exports = {
  getAdminStats,
  getRecentEmployees,
  getDoctorStats,
  getReceptionistStats,
  getTodayAppointments,
};