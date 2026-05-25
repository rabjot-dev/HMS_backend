const Patient =
require(
    "../models/Patient",
);

const registerPatient =
require(
    "../services/patient/register-patient.service",
);

/*
|--------------------------------------------------------------------------
| Register Patient
|--------------------------------------------------------------------------
*/
const createPatient =
async (req, res) => {

    try {

        const serviceResponse =

            await registerPatient(
                req.body,
            );

        return res.status(201)
            .json({

                success: true,

                message:
                    "Patient registered successfully",

                data:
                    serviceResponse,
            });
    }
    catch (error) {
        if (
    error.code === 11000
) {

    return res
        .status(400)
        .json({

            success: false,

            message:
            'Phone number already exists',
        });
}

        return res.status(400)
            .json({

                success: false,

                message:
                    error.message,
            });
    }
};

/*
|--------------------------------------------------------------------------
| Get All Patients
|--------------------------------------------------------------------------
*/
const getPatients =
async (req, res) => {

    const patients =

        await Patient.find()

            .populate(
                "assignedDoctor",
            )

            .sort({

                createdAt: -1,
            });

    return res.status(200)
        .json({

            success: true,

            data: patients,
        });
};

/*
|--------------------------------------------------------------------------
| Get Patient By ID
|--------------------------------------------------------------------------
*/
const getPatientById =
async (req, res) => {

    const patient =

        await Patient.findById(

            req.params.id,
        )

            .populate(
                "assignedDoctor",
            );

    return res.status(200)
        .json({

            success: true,

            data: patient,
        });
};

/*
|--------------------------------------------------------------------------
| Update Patient
|--------------------------------------------------------------------------
*/
const updatePatient =
async (req, res) => {

    const patient =

        await Patient.findByIdAndUpdate(

            req.params.id,

            req.body,

            {
                returnDocument:
                    "after",
            },
        );

    return res.status(200)
        .json({

            success: true,

            message:
                "Patient updated successfully",

            data: patient,
        });
};

module.exports = {

    createPatient,

    getPatients,

    getPatientById,

    updatePatient,
};