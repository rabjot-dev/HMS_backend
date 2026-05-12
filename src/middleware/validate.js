// middleware/validate.js

const validateSignup = (req, res, next) => {
    const {
        email,
        password,
        name,
        phone,
        department,
        designation,
        role
    } = req.body;

    if (!email || !password || !name || !phone || !department || !designation || !role) {
        return res.status(400).json({
            message: "Missing required fields: email, password, name, phone, department, designation, role"
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Invalid email format"
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters"
        });
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({
            message: "Phone number must be 10 digits"
        });
    }

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Invalid email format"
        });
    }

    next();
};
const validatePatientSignup = (req, res, next) => {
    const { email, password, name, phone } = req.body;

    if (!email || !password || !name || !phone) {
        return res.status(400).json({ message: "Missing required fields: email, password, name, phone" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: "Phone number must be 10 digits" });
    }

    next();
};
const validateResetPassword = (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
    }

    if (currentPassword === newPassword) {
        return res.status(400).json({ message: "New password must be different from current password" });
    }
    next();
}    

// update exports
module.exports = { validateSignup, validateLogin, validatePatientSignup, validateResetPassword };
