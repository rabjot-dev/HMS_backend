const bcrypt = require("bcryptjs");

const User = require("../../models/User");
const Employee = require("../../models/Employee");

const generateToken = require("../../utils/generateToken");

const loginUser = async (loginData) => {
    const { loginId, password } = loginData;

    let user = null;

    const isEmailLogin = loginId.includes("@");

    if (isEmailLogin) {
        user = await User.findOne({
            email: loginId.toLowerCase(),
        });
    } else {
        const employee = await Employee.findOne({
            employeeCode: loginId,
        });

        if (!employee) {
            throw new Error("Invalid credentials");
        }

        user = await User.findOne({
            employeeId: employee._id,
        });
    }

    if (!user) {
        throw new Error("Invalid credentials");
    }

    if (user.isFirstLogin) {
        throw new Error(
            "Password is not created for this account",
        );
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.passwordHash,
    );

    if (!isPasswordValid) {
        throw new Error("Invalid credentials");
    }

    const tokenPayload = {
        userId: user._id,
        roles: user.roles,
    };

    const token = generateToken(tokenPayload);

    user.lastLoginAt = new Date();

    await user.save();

    return {
        token,
        user,
    };
};

module.exports = loginUser;