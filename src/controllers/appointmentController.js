const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const User = require("../models/User");
const generateAppointmentCode = require("../utils/generateAppointmentCode");

exports.createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentDate, timeSlot, reason } = req.body;

    if (!patientId || !doctorId || !appointmentDate || !timeSlot || !reason) {
      return res.status(400).json({
        success: false,
        message: "All appointment fields are required",
      });
    }

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const doctor = await User.findById(doctorId);

    if (!doctor || doctor.role !== "DOCTOR") {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const startDate = new Date(appointmentDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(appointmentDate);
    endDate.setHours(23, 59, 59, 999);

    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate: {
        $gte: startDate,
        $lte: endDate,
      },
      timeSlot,
      status: { $ne: "CANCELLED" },
    });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message: "This time slot is already booked for selected doctor",
      });
    }

    const appointmentCount = await Appointment.countDocuments({
      doctorId,
      appointmentDate: {
        $gte: startDate,
        $lte: endDate,
      },
      status: { $ne: "CANCELLED" },
    });

    const tokenNo = appointmentCount + 1;
    const appointmentCode = await generateAppointmentCode();

    const appointment = await Appointment.create({
      appointmentCode,
      patientId,
      doctorId,
      doctorDepartment: doctor.department,
      tokenNo,
      appointmentDate,
      timeSlot,
      reason,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: appointment,
    });

  } catch (error) {
    console.log("CREATE APPOINTMENT ERROR:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This time slot is already booked for selected doctor",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while booking appointment",
    });
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, appointmentDate } = req.query;

    if (!doctorId || !appointmentDate) {
      return res.status(400).json({
        success: false,
        message: "Doctor and appointment date are required",
      });
    }

    const allSlots = [
      "09:00 AM",
      "09:30 AM",
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
      "12:00 PM",
      "12:30 PM",
      "02:00 PM",
      "02:30 PM",
      "03:00 PM",
      "03:30 PM",
      "04:00 PM",
      "04:30 PM",
    ];

    const startDate = new Date(appointmentDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(appointmentDate);
    endDate.setHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find({
      doctorId,
      appointmentDate: {
        $gte: startDate,
        $lte: endDate,
      },
      status: { $ne: "CANCELLED" },
    }).select("timeSlot");

    const bookedSlots = bookedAppointments.map((appointment) => appointment.timeSlot);

    const availableSlots = allSlots.filter(
      (slot) => !bookedSlots.includes(slot)
    );

    return res.status(200).json({
      success: true,
      data: availableSlots,
    });

  } catch (error) {
    console.log("GET AVAILABLE SLOTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching available slots",
    });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patientId", "patientCode name phone")
      .populate("doctorId", "employeeCode name department designation")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: appointments,
    });

  } catch (error) {
    console.log("GET APPOINTMENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching appointments",
    });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({
      role: "DOCTOR",
      status: "ACTIVE",
    }).select("-password_hash -temporaryPassword");

    return res.status(200).json({
      success: true,
      data: doctors,
    });

  } catch (error) {
    console.log("GET DOCTORS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching doctors",
    });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      appointmentDate,
      timeSlot,
      reason,
      status,
    } = req.body;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const finalDate = appointmentDate || appointment.appointmentDate;
    const finalSlot = timeSlot || appointment.timeSlot;

    const startDate = new Date(finalDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(finalDate);
    endDate.setHours(23, 59, 59, 999);

    const existingAppointment = await Appointment.findOne({
      _id: { $ne: id },
      doctorId: appointment.doctorId,
      appointmentDate: {
        $gte: startDate,
        $lte: endDate,
      },
      timeSlot: finalSlot,
      status: { $ne: "CANCELLED" },
    });

    if (existingAppointment && status !== "CANCELLED") {
      return res.status(409).json({
        success: false,
        message: "This time slot is already booked for selected doctor",
      });
    }

    if (appointmentDate) {
      appointment.appointmentDate = appointmentDate;
    }

    if (timeSlot) {
      appointment.timeSlot = timeSlot;
    }

    if (reason) {
      appointment.reason = reason;
    }

    if (status) {
      appointment.status = status;
    }

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: appointment,
    });

  } catch (error) {
    console.log("UPDATE APPOINTMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating appointment",
    });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });

  } catch (error) {
    console.log("DELETE APPOINTMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting appointment",
    });
  }
};

exports.getMyAppointments = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const appointments = await Appointment.find({
      doctorId,
    })
      .populate("patientId", "patientCode name phone age gender allergy")
      .populate("doctorId", "employeeCode name department designation")
      .sort({ appointmentDate: 1 });

    return res.status(200).json({
      success: true,
      data: appointments,
    });

  } catch (error) {
    console.log("GET MY APPOINTMENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching doctor appointments",
    });
  }
};