    const User = require("../model/User");
    const jwt = require("jsonwebtoken");
    const bcrypt = require("bcryptjs");
    const crypto = require("node:crypto");
    const appointment = require("../model/Appointment")
    const Employee = require("../model/Employee");
    const Patient = require("../model/Patient");

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

            console.log("STEP 1");

            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({
                    message: "User already exists"
                });
            }

        

            const password_hash = await bcrypt.hash(password, 12);

            console.log("STEP 3");

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

            console.log("EMPLOYEE CREATED");

            const user = await User.create({
                email,
                password_hash,
                role,
                employeeId: employee.employeeCode,
                status
            });

            console.log("USER CREATED");

            return res.status(201).json({
                message: "User created successfully",
                user
            });

        } catch (e) {

            console.error("FULL ERROR:", e);

            return res.status(500).json({
                message: "Internal Server Error",
                error: e.message
            });
        }
    };

    exports.login = async(req,res)=>{
        const{email,password} =req.body;

        const duplicate = await User.findOne({email});//Consist -->Specific User data

        if(!duplicate){
            return res.status(404).json({
                message:"User does not exist"
            });
        }
    if (await bcrypt.compare(password, duplicate.password_hash)){//Comparing

            const token = jwt.sign({
                id:duplicate._id,
                role:duplicate.role,
                email:duplicate.email

            },
            process.env.JWT_SECRET,
                { expiresIn: "1d" }
        
        );
      const employee = await Employee.findOne({ email: duplicate.email });
        if (duplicate.isFirstLogin) {
                return res.json({
                    message: "First login detected. Please reset your password.",
                    temporaryPassword: password,
                    isFirstLogin: true,
                    token,
                    role: duplicate.role,
                    employee
                });
            }
        
            res.json({
                message:"User logged in successfully",
                token,
                role: duplicate.role,
                employee
            });
        }
        else{
            res.json({
                message:"Incorrect Password"
            });
        };

    };

    exports.getAllEmployees=async(req,res)=>{
    try {

        const getAll=await Employee.find()
        return res.status(200).json({
        success:true,
        message:"all records fetched succesfully",
        count:getAll.length,
        data:getAll
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "error during fetching all records"})

    }
    }

    //  change password

    exports.resetPassword = async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;
            const user = await User.findById(req.user.id); // ← add this line
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
                isFirstLogin: false    // ← add this
            });
            return res.status(200).json({ message: "Password reset successfully. Please login again." }); // ← add this
        }
        catch (e) {
            console.error("FULL ERROR:", e);
            return res.status(500).json({ message: "Internal Server Error", error: e.message });
        }
    };    
exports.updateEmployee = async (req, res) => {
   
    try {
        const { employeeCode } = req.params;

       const updateData = req.body || {};

        // 1. Update Employee collection
        const updatedEmployee = await Employee.findOneAndUpdate(
            { employeeCode: employeeCode },
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

       
        const updatedUser = await User.findOneAndUpdate(
            { employeeId: employeeCode },
            {
                email: updateData.email,
                role: updateData.role,
                status: updateData.status
            },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Employee updated successfully",
            employee: updatedEmployee,
            user: updatedUser
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};



exports.getEmployeeById = async (req, res) => {
    
    try {
       

     const employee = await Employee.findOne({
    employeeCode: req.params.employeeCode
}).lean();

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Employee fetched successfully",
            employee
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};