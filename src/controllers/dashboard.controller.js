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
      message: "Admin dashboard statistics retrieved successfully",
      data: stats,
    });
  } catch (error) {
    console.error("GET ADMIN STATS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve admin dashboard statistics",
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
    const employees = await getRecentEmployeesService();

    return res.status(200).json({
      success: true,
      message: "Recent employees retrieved successfully",
      data: employees,
    });
  } catch (error) {
    console.error("GET RECENT EMPLOYEES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve recent employees",
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
      message: "Doctor dashboard statistics retrieved successfully",
      data: stats,
    });
  } catch (error) {
    console.error("GET DOCTOR STATS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve doctor dashboard statistics",
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
    const stats = await getReceptionistStatsService();

    return res.status(200).json({
      success: true,
      message: "Receptionist dashboard statistics retrieved successfully",
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
        "Failed to retrieve receptionist dashboard statistics",
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
      message: "Appointments retrieved successfully",
      data: appointments,
    });
  } catch (error) {
    console.error(
      "GET TODAY APPOINTMENTS ERROR:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve appointments",
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