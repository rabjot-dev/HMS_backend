const Appointment = require("../../models/Appointment");

const Employee = require("../../models/Employee");

const generateSlots = require("../../utils/generateSlots");

const getAvailableSlots = async (doctorId, appointmentDate) => {
  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */
  if (!doctorId || !appointmentDate) {
    throw new Error("Doctor ID and appointment date are required");
  }
  /*
|--------------------------------------------------------------------------
| Past Date Validation
|--------------------------------------------------------------------------
*/
  const selectedDate = new Date(appointmentDate);

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    throw new Error("Cannot select past dates");
  }

  /*
  |--------------------------------------------------------------------------
  | Find Doctor
  |--------------------------------------------------------------------------
  */
  const doctor = await Employee.findById(doctorId);

  if (!doctor) {
    throw new Error("Doctor not found");
  }

  /*
  |--------------------------------------------------------------------------
  | Doctor Availability
  |--------------------------------------------------------------------------
  */
  if (!doctor?.availability?.isAvailable) {
    throw new Error("Doctor is currently unavailable");
  }

  /*
  |--------------------------------------------------------------------------
  | Working Day Validation
  |--------------------------------------------------------------------------
  */
  const appointmentDay = new Date(appointmentDate)

    .toLocaleDateString("en-US", {
      weekday: "long",
    })

    .toUpperCase();

  if (!doctor?.availability?.workingDays?.includes(appointmentDay)) {
    throw new Error(`Doctor is not available on ${appointmentDay}`);
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
  | Booked Slots
  |--------------------------------------------------------------------------
  */
  const bookedSlots = new Set(
    bookedAppointments.map((appointment) => appointment.timeSlot),
  );

  /*
  |--------------------------------------------------------------------------
  | Available Slots
  |--------------------------------------------------------------------------
  */
  return allSlots.filter((slot) => !bookedSlots.has(slot));
};

module.exports = getAvailableSlots;
