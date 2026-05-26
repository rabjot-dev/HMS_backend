const Consultation =
    require(

        '../models/consultation',
    );

const Appointment =
    require(

        '../models/appointment',
    );

const generatePrescriptionPdf =
    require(

        '../utils/generatePrescriptionPdf',
    );

/*
|--------------------------------------------------------------------------
| Create Consultation
|--------------------------------------------------------------------------
*/
const createConsultation =
    async (req, res) => {

        try {

            const {

                appointmentId,

                diagnosis,

                symptoms,

                doctorNotes,

                vitals,

                prescriptions,

            } = req.body;

            /*
            |--------------------------------------------------------------------------
            | Check Existing Consultation
            |--------------------------------------------------------------------------
            */
            const existingConsultation =

                await Consultation
                    .findOne({

                        appointmentId,
                    });

            if (
                existingConsultation
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            'Consultation already exists',
                    });
            }

            /*
            |--------------------------------------------------------------------------
            | Find Appointment
            |--------------------------------------------------------------------------
            */
            const appointment =

                await Appointment
                    .findById(
                        appointmentId,
                    );

            /*
            |--------------------------------------------------------------------------
            | Appointment Not Found
            |--------------------------------------------------------------------------
            */
            if (
                !appointment
            ) {

                return res
                    .status(404)
                    .json({

                        success: false,

                        message:
                            'Appointment not found',
                    });
            }

            /*
            |--------------------------------------------------------------------------
            | Create Consultation
            |--------------------------------------------------------------------------
            */
            const consultation =

                await Consultation
                    .create({

                        appointmentId,

                        patientId:
                            appointment.patientId,

                        doctorEmployeeId:
                            appointment.doctorEmployeeId,

                        diagnosis,

                        symptoms,

                        doctorNotes,

                        vitals,

                        prescriptions,
                    });

            /*
            |--------------------------------------------------------------------------
            | Update Appointment Status
            |--------------------------------------------------------------------------
            */
            await Appointment
                .findByIdAndUpdate(

                    appointmentId,

                    {

                        status:
                            'COMPLETED',
                    },
                );

            /*
            |--------------------------------------------------------------------------
            | Response
            |--------------------------------------------------------------------------
            */
            return res
                .status(201)
                .json({

                    success: true,

                    message:
                        'Consultation created successfully',

                    data:
                        consultation,
                });

        } catch (error) {

            console.log(
                error,
            );

            return res
                .status(500)
                .json({

                    success: false,

                    message:
                        'Internal Server Error',
                });
        }
    };

/*
|--------------------------------------------------------------------------
| Get Consultation By Appointment
|--------------------------------------------------------------------------
*/
const getConsultationByAppointment =
    async (req, res) => {

        try {

            const {
                appointmentId,
            } = req.params;

            /*
            |--------------------------------------------------------------------------
            | Find Consultation
            |--------------------------------------------------------------------------
            */
            const consultation =

                await Consultation
                    .findOne({

                        appointmentId,
                    })

                    .populate(
                        'patientId',
                    )

                    .populate(
                        'doctorEmployeeId',
                    )

                    .populate(
                        'appointmentId',
                    );

            /*
            |--------------------------------------------------------------------------
            | Not Found
            |--------------------------------------------------------------------------
            */
            if (
                !consultation
            ) {

                return res
                    .status(404)
                    .json({

                        success: false,

                        message:
                            'Consultation not found',
                    });
            }

            /*
            |--------------------------------------------------------------------------
            | Response
            |--------------------------------------------------------------------------
            */
            return res
                .status(200)
                .json({

                    success: true,

                    data:
                        consultation,
                });

        } catch (error) {

            console.log(
                error,
            );

            return res
                .status(500)
                .json({

                    success: false,

                    message:
                        'Internal Server Error',
                });
        }
    };

/*
|--------------------------------------------------------------------------
| Update Consultation
|--------------------------------------------------------------------------
*/
const updateConsultation =
    async (req, res) => {

        try {

            const {
                id,
            } = req.params;

            /*
            |--------------------------------------------------------------------------
            | Update
            |--------------------------------------------------------------------------
            */
            const consultation =

                await Consultation
                    .findByIdAndUpdate(

                        id,

                        req.body,

                        {

                            new: true,
                        },
                    );

            /*
            |--------------------------------------------------------------------------
            | Not Found
            |--------------------------------------------------------------------------
            */
            if (
                !consultation
            ) {

                return res
                    .status(404)
                    .json({

                        success: false,

                        message:
                            'Consultation not found',
                    });
            }

            /*
            |--------------------------------------------------------------------------
            | Response
            |--------------------------------------------------------------------------
            */
            return res
                .status(200)
                .json({

                    success: true,

                    message:
                        'Consultation updated successfully',

                    data:
                        consultation,
                });

        } catch (error) {

            console.log(
                error,
            );

            return res
                .status(500)
                .json({

                    success: false,

                    message:
                        'Internal Server Error',
                });
        }
    };

/*
|--------------------------------------------------------------------------
| Get All Consultations
|--------------------------------------------------------------------------
*/
const getConsultations =
    async (req, res) => {

        try {

            const consultations =

                await Consultation
                    .find()

                    .populate(
                        'patientId',
                    )

                    .populate(
                        'doctorEmployeeId',
                    )

                    .populate(
                        'appointmentId',
                    )

                    .sort({

                        createdAt:
                            -1,
                    });

            return res
                .status(200)
                .json({

                    success: true,

                    data:
                        consultations,
                });

        } catch (error) {

            console.log(
                error,
            );

            return res
                .status(500)
                .json({

                    success: false,

                    message:
                        'Internal Server Error',
                });
        }
    };

/*
|--------------------------------------------------------------------------
| Download Prescription PDF
|--------------------------------------------------------------------------
*/
const downloadPrescriptionPdf =
    async (req, res) => {

        try {

            const {
                consultationId,
            } = req.params;

            /*
            |--------------------------------------------------------------------------
            | Find Consultation
            |--------------------------------------------------------------------------
            */
            const consultation =

                await Consultation
                    .findById(

                        consultationId,
                    )

                    .populate(
                        'patientId',
                    )

                    .populate(
                        'doctorEmployeeId',
                    )

                    .populate(
                        'appointmentId',
                    );

            /*
            |--------------------------------------------------------------------------
            | Not Found
            |--------------------------------------------------------------------------
            */
            if (
                !consultation
            ) {

                return res
                    .status(404)
                    .json({

                        success: false,

                        message:
                            'Consultation not found',
                    });
            }

            /*
            |--------------------------------------------------------------------------
            | Generate PDF
            |--------------------------------------------------------------------------
            */
            generatePrescriptionPdf(

                consultation,

                res,
            );

        } catch (error) {

            console.log(
                error,
            );

            return res
                .status(500)
                .json({

                    success: false,

                    message:
                        'Internal Server Error',
                });
        }
    };
    /*
|--------------------------------------------------------------------------
| Get Consultation By Id
|--------------------------------------------------------------------------
*/
const getConsultationById =
async (req, res) => {

    try {

        const consultation =

            await Consultation
                .findById(

                    req.params.id,
                )

                .populate(
                    'patientId',
                )

                .populate(
                    'doctorEmployeeId',
                )

                .populate(
                    'appointmentId',
                );

        if (
            !consultation
        ) {

            return res
                .status(404)
                .json({

                    success: false,

                    message:
                        'Consultation not found',
                });
        }

        return res
            .status(200)
            .json({

                success: true,

                data:
                    consultation,
            });

    } catch (error) {

        console.log(
            error,
        );

        return res
            .status(500)
            .json({

                success: false,

                message:
                    'Internal Server Error',
            });
    }
};

module.exports = {

    createConsultation,
    getConsultationById,

    getConsultationByAppointment,

    updateConsultation,

    getConsultations,

    downloadPrescriptionPdf,
};