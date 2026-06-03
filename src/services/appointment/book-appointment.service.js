const Appointment =
require(
  "../../models/Appointment",
);

const Employee =
require(
  "../../models/Employee",
);

const Patient =
require(
  "../../models/Patient",
);

const generateAppointmentId =
require(
  "../../utils/generateAppointmentId",
);

const bookAppointment =
async (
  appointmentData,
  user,
) => {

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
  } = appointmentData;

  /*
  |--------------------------------------------------------------------------
  | Past Date Validation
  |--------------------------------------------------------------------------
  */
  const selectedDate =

    new Date(
      appointmentDate,
    );

  const today =
    new Date();

  today.setHours(
    0,
    0,
    0,
    0,
  );

  selectedDate.setHours(
    0,
    0,
    0,
    0,
  );

  if (
    selectedDate <
    today
  ) {

    throw new Error(
      "Cannot book appointment for past dates",
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Validate Patient
  |--------------------------------------------------------------------------
  */
  const patient =

    await Patient.findById(
      patientId,
    );

  if (!patient) {

    throw new Error(
      "Patient not found",
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Validate Doctor
  |--------------------------------------------------------------------------
  */
  const doctor =

    await Employee.findById(
      doctorId,
    );

  if (!doctor) {

    throw new Error(
      "Doctor not found",
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Doctor Availability
  |--------------------------------------------------------------------------
  */
  if (
    !doctor
      ?.availability
      ?.isAvailable
  ) {

    throw new Error(
      "Doctor is currently unavailable",
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Working Day Validation
  |--------------------------------------------------------------------------
  */
  const appointmentDay =

    new Date(
      appointmentDate,
    )

      .toLocaleDateString(
        "en-US",
        {
          weekday:
            "long",
        },
      )

      .toUpperCase();

  if (

    !doctor
      ?.availability
      ?.workingDays
      ?.includes(
        appointmentDay,
      )

  ) {

    throw new Error(

      `Doctor is not available on ${appointmentDay}`,
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Break Validation
  |--------------------------------------------------------------------------
  */
  const breakStartTime =

    doctor
      ?.availability
      ?.breakStartTime;

  const breakEndTime =

    doctor
      ?.availability
      ?.breakEndTime;

  if (
    breakStartTime &&
    breakEndTime
  ) {

    if (

      appointmentTime >=
      breakStartTime

      &&

      appointmentTime <
      breakEndTime

    ) {

      throw new Error(

        "Selected slot falls during doctor break time",
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Normalize Date
  |--------------------------------------------------------------------------
  */
  const normalizedDate =

    new Date(
      appointmentDate,
    );

  normalizedDate.setHours(
    0,
    0,
    0,
    0,
  );

  const nextDay =
    new Date(
      normalizedDate,
    );

  nextDay.setDate(
    nextDay.getDate()
      + 1,
  );

  /*
  |--------------------------------------------------------------------------
  | Max Patients Validation
  |--------------------------------------------------------------------------
  */
  const totalAppointments =

    await Appointment.countDocuments({

      doctorEmployeeId:
        doctorId,

      appointmentDate: {

        $gte:
          normalizedDate,

        $lt:
          nextDay,
      },

      status: {

        $ne:
          "CANCELLED",
      },
    });

  if (

    totalAppointments >=

    doctor
      ?.availability
      ?.maxPatientsPerDay

  ) {

    throw new Error(

      "Maximum patient limit reached for this doctor",
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Doctor Slot Conflict
  |--------------------------------------------------------------------------
  */
  const existingAppointment =

    await Appointment.findOne({

      doctorEmployeeId:
        doctorId,

      timeSlot:
        appointmentTime,

      appointmentDate: {

        $gte:
          normalizedDate,

        $lt:
          nextDay,
      },

      status: {

        $nin: [

          "CANCELLED",

          "NO_SHOW",
        ],
      },
    });

  if (
    existingAppointment
  ) {

    throw new Error(
      "Selected slot already booked",
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Duplicate Patient Booking
  |--------------------------------------------------------------------------
  */
  const existingPatientAppointment =

    await Appointment.findOne({

      patientId,

      timeSlot:
        appointmentTime,

      appointmentDate: {

        $gte:
          normalizedDate,

        $lt:
          nextDay,
      },

      status: {

        $nin: [

          "CANCELLED",

          "NO_SHOW",
        ],
      },
    });

  if (
    existingPatientAppointment
  ) {

    throw new Error(

      "Patient already has an appointment at this time",
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Appointment ID
  |--------------------------------------------------------------------------
  */
  const appointmentId =

    await generateAppointmentId();

  /*
  |--------------------------------------------------------------------------
  | Token Number
  |--------------------------------------------------------------------------
  */
  const todayAppointmentsCount =

    await Appointment.countDocuments({

      doctorEmployeeId:
        doctorId,

      appointmentDate: {

        $gte:
          normalizedDate,

        $lt:
          nextDay,
      },
    });

  const tokenNumber =

    todayAppointmentsCount
    + 1;

  /*
  |--------------------------------------------------------------------------
  | Create Appointment
  |--------------------------------------------------------------------------
  */
  const appointment =

    await Appointment.create({

      appointmentId,

      patientId,

      doctorEmployeeId:
        doctorId,

      appointmentDate:
        normalizedDate,

      timeSlot:
        appointmentTime,

      appointmentType,

      priority,

      paymentStatus,

      visitMode,

      symptoms,

      reason,

      notes,

      tokenNumber,

      createdByEmployeeId:
        user.userId,

      status:
        "BOOKED",
    });

  return appointment;
};

module.exports =
  bookAppointment;