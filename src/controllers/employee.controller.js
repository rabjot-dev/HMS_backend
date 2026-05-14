const registerEmployee = require("../services/employee/register-employee.service",);

const createEmployee = async (req, res,) => {
    try {
        const serviceResponse =
            await registerEmployee(req.body);

        return res.status(201).json({
            success: true,
            message:
                "Employee registered successfully",
            data: serviceResponse,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = { createEmployee, };