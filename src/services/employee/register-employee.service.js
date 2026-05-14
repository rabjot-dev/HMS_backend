const Employee = require("../../models/Employee");
const User = require("../../models/User");
const EMPLOYEE_PREFIX = require("../../constants/employee-prefix",);
const bcrypt = require("bcryptjs");

const generateTemporaryPassword = require("../../utils/generateTemporaryPassword",);


const generateSequentialId = require(
    "../../utils/generateSequentialId",
);

const registerEmployee = async (
    employeeData,
) => {
    const {
        name,
        email,
        phone,
        department,
        designation,
        joiningDate,
        medicalRegistrationNo,
        specialization,
        qualification,
        consultationFee,
        availabilitySlots,
        role,
    } = employeeData;

    const existingUser = await User.findOne({
        email: email.toLowerCase(),
    });

    if (existingUser) {
        throw new Error(
            "Employee already exists with this email",
        );
    }

    const prefix =
        EMPLOYEE_PREFIX[designation];

    if (!prefix) {
        throw new Error(
            "Invalid employee designation",
        );
    }

    const employeeCode =
        await generateSequentialId(prefix);

    const employee = await Employee.create({
        employeeCode,
        name,
        email: email.toLowerCase(),
        phone,
        department,
        designation,
        joiningDate,
        medicalRegistrationNo,
        specialization,
        qualification,
        consultationFee,
        availabilitySlots,
    });

    const temporaryPassword =
        generateTemporaryPassword();

    const hashedTemporaryPassword =
        await bcrypt.hash(
            temporaryPassword,
            10,
        );

    await User.create({
        email: email.toLowerCase(),
        passwordHash:
            hashedTemporaryPassword,
        roles: [role || ROLES.DOCTOR],
        employeeId: employee._id,
        isFirstLogin: true,
    });
    return {
        message: "Employee registered successfully",
        employee,
        temporaryPassword,
    };
};

module.exports = registerEmployee;