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

        console.log("STEP 2");

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

    const duplicate = await User.findOne({email});

    if(!duplicate){
        return res.status(404).json({
            message:"User doesnot exist"
        });
    }
   if (await bcrypt.compare(password, duplicate.password_hash)){

        const token = jwt.sign({
            id:duplicate._id,
            role:duplicate.role,
            email:duplicate.email

        },
        process.env.JWT_SECRET,
            { expiresIn: "1d" }
    
    );
    if (duplicate.isFirstLogin) {
            return res.json({
                message: "First login detected. Please reset your password.",
                temporaryPassword: password,
                isFirstLogin: true,
                token
            });
        }
       
        res.json({
            message:"User logged in successfully",
            token
        });
    }
    else{
        res.json({
            message:"Incorrect Password"
        });
    };

};
exports.patientSignup = async (req, res) => {

    try {

        const {
            email,
            password,
            name,
            phone,
            gender,
            dob,
            address,
            emergency_contact_number,
            
        } = req.body;

        console.log("STEP 1");

        const existingPatient= await User.findOne({ email });

        if (existingPatient) {
            return res.status(400).json({
                message: "Patient already exists"
            });
        }

        console.log("STEP 2");

        const password_hash = await bcrypt.hash(password, 12);

        console.log("STEP 3");

        const patient = await Patient.create({
            name,
            phone,
            email,
            gender,
            dob,
            address,
            emergency_contact_number,
            
        });

        console.log("PATIENT CREATED");

        const user = await User.create({
            email,
            password_hash,
            role:"Patient",
            patientId: patient.UHID,
           
        });

        console.log("USER CREATED");

        return res.status(201).json({
            message: "Patient created successfully",
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

exports.getAllAppointments=async(req,res)=>{
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


//update user

exports.updateUser = async (req, res) => {
  try {
    const { name, phone, department, specialization, qualification } = req.body;
    const user = await User.findById(req.user.id).select("-passwordHash -__v");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const employee = await Employee.findOne({
      email: user.email,
    });

    if (name) {
      employee.name = name;
    }
    if (phone) {
      employee.phone = phone;
    }
    if (department) {
      employee.department = department;
    }
    if (specialization) {
      employee.specialization = specialization;
    }
    if (qualification) {
      employee.qualification = qualification;
    }
    await employee.save();
    res.status(200).json({
      message: "Updation successful",
      user: {
        name: employee.name,
        phone: employee.phone,
        department: employee.department,
        specialization: employee.specialization,
        qualification: employee.qualification,
      },
    });
  } catch (error) {
    console.error("Error in updating", error);
    res.status(500).json({ message: error.message });
  }
};

