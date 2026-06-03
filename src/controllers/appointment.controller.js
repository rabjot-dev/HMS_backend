const Appointment = require("../models/Appointment");

const getAvailableSlotsService = require("../services/appointment/get-available-slots.service");

const bookAppointmentService = require("../services/appointment/book-appointment.service");

/*
|--------------------------------------------------------------------------
| Get Available Slots
|--------------------------------------------------------------------------
*/
const getAvailableSlots = async (req, res) => {
  try {
    const {
      doctorId,

      appointmentDate,
    } = req.query;

    const availableSlots = await getAvailableSlotsService(
      doctorId,

      appointmentDate,
    );

    return res.status(200).json({
      success: true,

      data: availableSlots,
    });
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Book Appointment
|--------------------------------------------------------------------------
*/
const bookAppointment = async (req, res) => {
  try {
    const appointment = await bookAppointmentService(
      req.body,

      req.user,
    );

    return res.status(201).json({
      success: true,

      message: "Appointment booked successfully",

      data: appointment,
    });
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Appointments
|--------------------------------------------------------------------------
*/
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()

      .populate("patientId")

      .populate("doctorEmployeeId")

      .sort({
        appointmentDate: -1,
      });

    return res.status(200).json({
      success: true,

      data: appointments,
    });
  } catch (error) {
    console.log("GET APPOINTMENTS ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Internal Server Error",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Delete Appointment
|--------------------------------------------------------------------------
*/
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,

        message: "Appointment not found",
      });
    }

    await Appointment.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,

      message: "Appointment deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: "Internal Server Error",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Appointment By ID
|--------------------------------------------------------------------------
*/
const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)

      .populate("patientId")

      .populate("doctorEmployeeId");

    if (!appointment) {
      return res.status(404).json({
        success: false,

        message: "Appointment not found",
      });
    }

    return res.status(200).json({
      success: true,

      data: appointment,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: "Internal Server Error",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Update Appointment
|--------------------------------------------------------------------------
*/
const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      doctorEmployeeId,

      appointmentDate,

      timeSlot,

      appointmentType,

      priority,

      paymentStatus,

      visitMode,

      status,

      reason,

      notes,

      symptoms,
    } = req.body;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,

        message: "Appointment not found",
      });
    }

    appointment.doctorEmployeeId = doctorEmployeeId;

    appointment.appointmentDate = appointmentDate;

    appointment.timeSlot = timeSlot;

    appointment.appointmentType = appointmentType;

    appointment.priority = priority;

    appointment.paymentStatus = paymentStatus;

    appointment.visitMode = visitMode;

    appointment.status = status;

    appointment.reason = reason;

    appointment.notes = notes;

    appointment.symptoms = symptoms;

    await appointment.save();

    return res.status(200).json({
      success: true,

      message: "Appointment updated successfully",

      data: appointment,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: "Internal Server Error",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Doctor Queue
|--------------------------------------------------------------------------
*/
const getDoctorQueue = async (req, res) => {
  try {
    const { doctorEmployeeId } = req.query;

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);

    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await Appointment.find({
      doctorEmployeeId,

      appointmentDate: {
        $gte: today,

        $lt: tomorrow,
      },
    })

      .populate("patientId")

      .sort({
        tokenNumber: 1,
      });

    return res.status(200).json({
      success: true,

      data: appointments,
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
  getAvailableSlots,

  bookAppointment,

  getAppointments,

  deleteAppointment,

  getAppointmentById,

  updateAppointment,

  getDoctorQueue,
};
