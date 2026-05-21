const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("node:crypto");
const appointment = require("../model/Appointment")
const Employee = require("../model/Employee");
const Patient = require("../model/Patient");
const sendEmail = require("../utils/mailer");

exports.signup = async (req, res) => {

    try {

        const {
            email,
            password,
            name,
            phone,
            department,
            designation,
            medical_reg_number,
            status,
            specialisation,
            role
        } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }
        const temporaryPassword = crypto.randomBytes(5).toString('hex');
        const password_hash = await bcrypt.hash(temporaryPassword, 12);

        const employee = await Employee.create({
            name,
            phone,
            email,
            department,
            designation,
            medical_reg_number,
            specialisation,
            status,
        });

        const user = await User.create({
            email,
            password_hash,
            role,
            employeeId: employee.employeeCode,
            status,
            isFirstLogin: true
        });

        await sendEmail({

            to: email,

            subject: "HMS Employee Account Created",

            html: `
        <h2>Welcome to HMS</h2>
 
        <p>Your account has been created.</p>
 
        <p>
            <strong>Email:</strong> ${email}
        </p>
 
        <p>
            <strong>Temporary Password:</strong> ${temporaryPassword}
        </p>
 
        <p>
            Please reset your password after login.
        </p>
    `
        });



        return res.status(201).json({
            message: "User created successfully",
            user
        });

    } catch (e) {


        return res.status(500).json({
            message: "Internal Server Error",
            error: e.message
        });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log('LOGIN ATTEMPT:', email);
    const duplicate = await User.findOne({ email });
    console.log('USER FOUND:', duplicate);

    if (!duplicate) {
        return res.status(404).json({
            message: "User doesnot exist"
        });
    }
    if (await bcrypt.compare(password, duplicate.password_hash)) {

        const token = jwt.sign(
            {
                id: duplicate._id,
                role: duplicate.role,
                email: duplicate.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // FIRST LOGIN
        if (duplicate.isFirstLogin) {

            return res.json({
                message: "First login detected. Please reset your password.",
                isFirstLogin: true,
                token,
                role: duplicate.role
            });

        }

        // NORMAL LOGIN
        return res.json({
            message: "User logged in successfully",
            token,
            role: duplicate.role
        });

    } else {

        return res.status(401).json({
            message: "Incorrect Password"
        });

    }
};

exports.getAllEmployees = async (req, res) => {
    try {

        const getAll = await Employee.find()
        return res.status(200).json({
            success: true,
            message: "All records fetched Succesfully",
            count: getAll.length,
            data: getAll
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Error during fetching all records" })

    }
}

// exports.getEmployeeById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select("-passwordhash -__v");
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json({
//       user: {
//         id: user._id,
//         email: user.email,
//         roles: user.roles,
//         last_login: user.lastLoginAt,
//         created_at: user.createdAt,
//       },
//     });
//   } catch (error) {
//     console.error("Unavailable to fetch current user", error);
//     res.status(500).json({ message: error.message });
//   }
// };


exports.resetPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        const password_hash = await bcrypt.hash(newPassword, 12);

        await User.findByIdAndUpdate(req.user.id, {
            password_hash,
            isFirstLogin: false
        });
        return res.status(200).json({ message: "Password reset successfully. Please login again." });
    }
    catch (e) {
        console.error("FULL ERROR:", e);
        return res.status(500).json({ message: "Internal Server Error", error: e.message });
    }
};
exports.getMyProfile = async (req, res) => {
    res.set('Cache-Control', 'no-store');
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const employee = await Employee.findOne({ email: user.email });
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        return res.status(200).json({
            name: employee.name,
            email: employee.email,
            phone: employee.phone,
            department: employee.department,
            designation: employee.designation,
            employeeCode: employee.employeeCode,
        });

    } catch (e) {
        return res.status(500).json({ message: "Internal Server Error", error: e.message });
    }
};
exports.updateEmployee = async (req, res) => {
    try {
        const { name, phone, department, designation, status } = req.body;
        const updated = await Employee.findByIdAndUpdate(
            req.params.id,
            { name, phone, department, designation, status },
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        return res.status(200).json({ message: 'Employee updated successfully', data: updated });
    } catch (e) {
        return res.status(500).json({ message: 'Internal Server Error', error: e.message });
    }
};

