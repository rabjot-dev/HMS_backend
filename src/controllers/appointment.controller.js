const Appointment = require("../models/Appointment");

const Employee = require("../models/Employee");

const Patient = require("../models/Patient");

const generateSlots = require("../utils/generateSlots");

const generateAppointmentId = require("../utils/generateAppointmentId");

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

    /*
        |--------------------------------------------------------------------------
        | Validate
        |--------------------------------------------------------------------------
        */
    if (!doctorId || !appointmentDate) {
      return res.status(400).json({
        success: false,

        message: "Doctor ID and appointment date are required",
      });
    }

    /*
        |--------------------------------------------------------------------------
        | Find Doctor
        |--------------------------------------------------------------------------
        */
    const doctor = await Employee.findById(doctorId);

    /*
        |--------------------------------------------------------------------------
        | Doctor Not Found
        |--------------------------------------------------------------------------
        */
    if (!doctor) {
      return res.status(404).json({
        success: false,

        message: "Doctor not found",
      });
    }

    /*
        |--------------------------------------------------------------------------
        | Doctor Availability Check
        |--------------------------------------------------------------------------
        */
    if (!doctor?.availability?.isAvailable) {
      return res.status(400).json({
        success: false,

        message: "Doctor is currently unavailable",
      });
    }

    /*
        |--------------------------------------------------------------------------
        | Working Day Validation
        |--------------------------------------------------------------------------
        */
    const appointmentDay = new Date(appointmentDate)

      .toLocaleDateString(
        "en-US",

        {
          weekday: "long",
        },
      )

      .toUpperCase();

    /*
        |--------------------------------------------------------------------------
        | Check Working Day
        |--------------------------------------------------------------------------
        */
    if (!doctor?.availability?.workingDays?.includes(appointmentDay)) {
      return res.status(400).json({
        success: false,

        message: `Doctor is not available on ${appointmentDay}`,
      });
    }

    /*
        |--------------------------------------------------------------------------
        | Generate All Slots
        |--------------------------------------------------------------------------
        */
    const allSlots = generateSlots(
      doctor?.availability?.startTime,

      doctor?.availability?.endTime,

      doctor?.availability?.slotDuration,

      doctor?.availability?.breakStartTime,

      doctor?.availability?.breakEndTime,
    );

    /*
        |--------------------------------------------------------------------------
        | Normalize Date
        |--------------------------------------------------------------------------
        */
    const normalizedDate = new Date(appointmentDate);

    normalizedDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(normalizedDate);

    nextDay.setDate(nextDay.getDate() + 1);

    /*
        |--------------------------------------------------------------------------
        | Existing Appointments
        |--------------------------------------------------------------------------
        */
    const bookedAppointments = await Appointment.find({
      doctorEmployeeId: doctorId,

      appointmentDate: {
        $gte: normalizedDate,

        $lt: nextDay,
      },

      status: {
        $nin: ["CANCELLED", "NO_SHOW"],
      },
    });

    /*
        |--------------------------------------------------------------------------
        | Extract Booked Slots
        |--------------------------------------------------------------------------
        */
    const bookedSlots = bookedAppointments.map(
      (appointment) => appointment.timeSlot,
    );

    /*
        |--------------------------------------------------------------------------
        | Remove Booked Slots
        |--------------------------------------------------------------------------
        */
    const availableSlots = allSlots.filter(
      (slot) => !bookedSlots.includes(slot),
    );

    /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */
    return res.status(200).json({
      success: true,

      data: availableSlots,
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
| Book Appointment
|--------------------------------------------------------------------------
*/
const bookAppointment = async (req, res) => {
  try {
    const {
      patientId,

      doctorId,

      appointmentDate,

      appointmentTime,

      reason,

      notes,

      appointmentType,

      priority,

      paymentStatus,

      visitMode,

      symptoms,
    } = req.body;

    /*
        |--------------------------------------------------------------------------
        | Validate Patient
        |--------------------------------------------------------------------------
        */
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({
        success: false,

        message: "Patient not found",
      });
    }

    /*
        |--------------------------------------------------------------------------
        | Validate Doctor
        |--------------------------------------------------------------------------
        */
    const doctor = await Employee.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,

        message: "Doctor not found",
      });
    }

    /*
        |--------------------------------------------------------------------------
        | Doctor Availability Check
        |--------------------------------------------------------------------------
        */
    if (!doctor?.availability?.isAvailable) {
      return res.status(400).json({
        success: false,

        message: "Doctor is currently unavailable",
      });
    }

    /*
        |--------------------------------------------------------------------------
        | Working Day Validation
        |--------------------------------------------------------------------------
        */
    const appointmentDay = new Date(appointmentDate)

      .toLocaleDateString(
        "en-US",

        {
          weekday: "long",
        },
      )

      .toUpperCase();

    if (!doctor?.availability?.workingDays?.includes(appointmentDay)) {
      return res.status(400).json({
        success: false,

        message: `Doctor is not available on ${appointmentDay}`,
      });
    }

    /*
        |--------------------------------------------------------------------------
        | Break Time Validation
        |--------------------------------------------------------------------------
        */
    const breakStartTime = doctor?.availability?.breakStartTime;

    const breakEndTime = doctor?.availability?.breakEndTime;

    if (breakStartTime && breakEndTime) {
      if (appointmentTime >= breakStartTime && appointmentTime < breakEndTime) {
        return res.status(400).json({
          success: false,

          message: "Selected slot falls during doctor break time",
        });
      }
    }

    /*
        |--------------------------------------------------------------------------
        | Normalize Date
        |--------------------------------------------------------------------------
        */
    const normalizedDate = new Date(appointmentDate);

    normalizedDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(normalizedDate);

    nextDay.setDate(nextDay.getDate() + 1);

    /*
        |--------------------------------------------------------------------------
        | Max Patients Validation
        |--------------------------------------------------------------------------
        */
    const totalAppointments = await Appointment.countDocuments({
      doctorEmployeeId: doctorId,

      appointmentDate: {
        $gte: normalizedDate,

        $lt: nextDay,
      },

      status: {
        $ne: "CANCELLED",
      },
    });

    if (totalAppointments >= doctor?.availability?.maxPatientsPerDay) {
      return res.status(400).json({
        success: false,

        message: "Maximum patient limit reached for this doctor",
      });
    }

    /*
        |--------------------------------------------------------------------------
        | Check Doctor Slot Conflict
        |--------------------------------------------------------------------------
        */
    const existingAppointment = await Appointment.findOne({
      doctorEmployeeId: doctorId,

      timeSlot: appointmentTime,

      appointmentDate: {
        $gte: normalizedDate,

        $lt: nextDay,
      },

      status: {
        $nin: ["CANCELLED", "NO_SHOW"],
      },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,

        message: "Selected slot already booked",
      });
    }

    /*
        |--------------------------------------------------------------------------
        | Prevent Duplicate Patient Booking
        |--------------------------------------------------------------------------
        */
    const existingPatientAppointment = await Appointment.findOne({
      patientId,

      timeSlot: appointmentTime,

      appointmentDate: {
        $gte: normalizedDate,

        $lt: nextDay,
      },

      status: {
        $nin: ["CANCELLED", "NO_SHOW"],
      },
    });

    if (existingPatientAppointment) {
      return res.status(400).json({
        success: false,

        message: "Patient already has an appointment at this time",
      });
    }

    /*
        |--------------------------------------------------------------------------
        | Generate Appointment ID
        |--------------------------------------------------------------------------
        */
    const appointmentId = await generateAppointmentId();

    /*
        |--------------------------------------------------------------------------
        | Generate Token Number
        |--------------------------------------------------------------------------
        */
    const todayAppointmentsCount = await Appointment.countDocuments({
      doctorEmployeeId: doctorId,

      appointmentDate: {
        $gte: normalizedDate,

        $lt: nextDay,
      },
    });

    const tokenNumber = todayAppointmentsCount + 1;

    /*
        |--------------------------------------------------------------------------
        | Create Appointment
        |--------------------------------------------------------------------------
        */
    const appointment = await Appointment.create({
      appointmentId,

      patientId,

      doctorEmployeeId: doctorId,

      appointmentDate: normalizedDate,

      timeSlot: appointmentTime,

      appointmentType,

      priority,

      paymentStatus,

      visitMode,

      symptoms,

      reason,

      notes,

      tokenNumber,

      createdByEmployeeId: req.user.userId,

      status: "BOOKED",
    });

    /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */
    return res.status(201).json({
      success: true,

      message: "Appointment booked successfully",

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
