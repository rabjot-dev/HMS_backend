const bcrypt = require("bcryptjs");

const User = require("../../models/User");

const createEmployeePassword = async (passwordData) => {
    const { email, password } = passwordData;

    const user = await User.findOne({
        email: email.toLowerCase(),
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (!user.isFirstLogin) {
        throw new Error(
            "Password is already created for this account",
        );
    }

    const hashedPassword = await bcrypt.hash(
        password,
        10,
    );

    user.passwordHash = hashedPassword;

    user.isFirstLogin = false;

    await user.save();

    return {
        message: "Password created successfully",
    };
};

module.exports = createEmployeePassword;