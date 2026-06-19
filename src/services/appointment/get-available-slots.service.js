const Appointment = require("../../models/Appointment");
const Employee = require("../../models/Employee");

const generateSlots = require("../../utils/generateSlots");

const getAvailableSlots = async (doctorId, appointmentDate) => {
  // Validate required fields
  if (!doctorId || !appointmentDate) {
    throw new Error("Doctor ID and appointment date are required");
  }

  // Prevent slot lookup for past dates
  const selectedDate = new Date(appointmentDate);
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    throw new Error("Cannot select past dates");
  }

  // Find doctor record
const doctor =
  await Employee.findOne({
    _id: doctorId,
    isDeleted: false,
  });

  if (!doctor) {
    throw new Error("Doctor not found");
  }

  // Check doctor availability status
  if (!doctor?.availability?.isAvailable) {
    throw new Error("Doctor is currently unavailable");
  }

  // Verify doctor works on selected day
  const appointmentDay = new Date(appointmentDate)
    .toLocaleDateString("en-US", {
      weekday: "long",
    })
    .toUpperCase();

  if (!doctor?.availability?.workingDays?.includes(appointmentDay)) {
    throw new Error(`Doctor is not available on ${appointmentDay}`);
  }

  // Generate all possible slots
  const allSlots = generateSlots(
    doctor?.availability?.startTime,
    doctor?.availability?.endTime,
    doctor?.availability?.slotDuration,
    doctor?.availability?.breakStartTime,
    doctor?.availability?.breakEndTime
  );

  // Normalize date for appointment search
  const normalizedDate = new Date(appointmentDate);

  normalizedDate.setHours(0, 0, 0, 0);

  const nextDay = new Date(normalizedDate);
  nextDay.setDate(nextDay.getDate() + 1);

  // Fetch existing appointments
const bookedAppointments =
  await Appointment.find({
    doctorEmployeeId:
      doctorId,

    appointmentDate: {
      $gte:
        normalizedDate,

      $lt: nextDay,
    },

    status: {
      $nin: [
        STATUS.CANCELLED,
        STATUS.REJECTED,
        STATUS.NO_SHOW,
      ],
    },

    isDeleted: false,
  });
  // Create set of booked time slots
  const bookedSlots = new Set(
    bookedAppointments.map((appointment) => appointment.timeSlot)
  );
  // Remove past slots if selected date is today

let availableSlots =
  allSlots.filter(
    (slot) =>
      !bookedSlots.has(slot)
  );

const currentDate =
  new Date();

const isToday =
  normalizedDate.toDateString() ===
  currentDate.toDateString();

if (isToday) {

  availableSlots =
    availableSlots.filter(
      (slot) => {

        const [
          time,
          period,
        ] = slot.split(" ");

        let [
          hours,
          minutes,
        ] = time
          .split(":")
          .map(Number);

        if (
          period === "PM" &&
          hours !== 12
        ) {
          hours += 12;
        }

        if (
          period === "AM" &&
          hours === 12
        ) {
          hours = 0;
        }

        const slotDate =
          new Date();

        slotDate.setHours(
          hours,
          minutes,
          0,
          0
        );

        return (
          slotDate >
          currentDate
        );
      }
    );
}

return availableSlots;
};

module.exports = getAvailableSlots;