const Employee = require("../../models/Employee");

const User = require("../../models/User");

const EMPLOYEE_PREFIX = require("../../constants/employee-prefix");

const bcrypt = require("bcryptjs");

const ROLES = require("../../constants/roles");

const STATUS = require("../../constants/status");

const generateTemporaryPassword = require("../../utils/generateTemporaryPassword");

const generateSequentialId = require("../../utils/generateSequentialId");

/*
|--------------------------------------------------------------------------
| Email Utils
|--------------------------------------------------------------------------
*/
const sendEmail = require("../../utils/sendEmail");

const employeeWelcomeTemplate = require("../../templates/employeeWelcomeTemplate");

const registerEmployee = async (employeeData) => {
  const {
    name,
    email,
    phone,
    gender,
    department,
    designation,
    joiningDate,
    medicalRegistrationNo,
    specialization,
    qualification,
    consultationFee,
    availabilitySlots,
    workingDays,

    startTime,

    endTime,

    slotDuration,

    breakStartTime,

    breakEndTime,

    maxPatientsPerDay,
    securityQuestion,

    securityAnswer,
    role,
  } = employeeData;

  /*
        |--------------------------------------------------------------------------
        | Existing User Check
        |--------------------------------------------------------------------------
        */
  const existingUser = await User.findOne({
    email: email.toLowerCase(),
  });

  if (existingUser) {
    throw new Error("Employee already exists with this email");
  }
/*
|--------------------------------------------------------------------------
| Existing Phone Check
|--------------------------------------------------------------------------
*/
const existingPhone = await Employee.findOne({
  phone,
});

if (existingPhone) {
  throw new Error(
    "Employee already exists with this phone number",
  );
}
  /*
        |--------------------------------------------------------------------------
        | Employee Prefix
        |--------------------------------------------------------------------------
        */
  const prefix = EMPLOYEE_PREFIX[designation];

  if (!prefix) {
    throw new Error("Invalid employee designation");
  }

  /*
        |--------------------------------------------------------------------------
        | Employee Code
        |--------------------------------------------------------------------------
        */
  const employeeCode = await generateSequentialId(prefix);

  /*
        |--------------------------------------------------------------------------
        | Create Employee
        |--------------------------------------------------------------------------
        */
  const employee = await Employee.create({
    employeeCode,

    name,

    email: email.toLowerCase(),

    phone,

    department,
    gender,

    designation,

    joiningDate,

    medicalRegistrationNo,

    specialization,

    qualification,

    consultationFee,

    availabilitySlots,
    availability: {
      workingDays: workingDays || [],

      startTime,

      endTime,

      slotDuration: slotDuration || 15,

      breakStartTime,

      breakEndTime,

      maxPatientsPerDay: maxPatientsPerDay || 40,
    },

    status: STATUS.ACTIVE,
  });

  /*
        |--------------------------------------------------------------------------
        | Generate Temporary Password
        |--------------------------------------------------------------------------
        */
  const temporaryPassword = generateTemporaryPassword();

  console.log(temporaryPassword);

  const hashedTemporaryPassword = await bcrypt.hash(
    temporaryPassword,

    10,
  );

  /*
        |--------------------------------------------------------------------------
        | Create User
        |--------------------------------------------------------------------------
        */
  await User.create({
    email: email.toLowerCase(),

    temporaryPasswordHash: hashedTemporaryPassword,

    roles: [role || designation || ROLES.DOCTOR],

    employeeId: employee._id,

    isFirstLogin: true,

    status: STATUS.ACTIVE,
    securityQuestion,

    securityAnswer,
  });

  /*
        |--------------------------------------------------------------------------
        | Send Welcome Email
        |--------------------------------------------------------------------------
        */
  console.log("Before Email Send");

  const loginLink = `${process.env.FRONTEND_URL}/login`;

  const htmlContent = employeeWelcomeTemplate({
    name,

    email,

    employeeCode,

    temporaryPassword,

    loginLink,
  });

  await sendEmail({
    to: email,

    subject: "Welcome to HMS",

    htmlContent,
  });

  console.log("After Email Send");

  /*
        |--------------------------------------------------------------------------
        | Final Response
        |--------------------------------------------------------------------------
        */
  return {
    message: "Employee registered successfully",

    employee,

    temporaryPassword,
  };
};

module.exports = registerEmployee;
