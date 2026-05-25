const express =
require(
    'express',
);

const router =
express.Router();

const {

    createConsultation,

    getConsultationByAppointment,

    updateConsultation,

    getConsultations,
    downloadPrescriptionPdf,

} = require(

    '../controllers/consultation.controller',
);

const authMiddleware =
require(

    '../middleware/auth.middleware',
);

/*
|--------------------------------------------------------------------------
| Role Middleware
|--------------------------------------------------------------------------
*/
const authorizeRoles =
(...roles) => {

    return (
        req,
        res,
        next,
    ) => {

        const userRoles =
            req.user.roles;

        const hasAccess =

            userRoles.some(

                (
                    role,
                ) =>

                    roles.includes(
                        role,
                    ),
            );

        if (!hasAccess) {

            return res
                .status(403)
                .json({

                    success: false,

                    message:
                    'Access Denied',
                });
        }

        next();
    };
};

/*
|--------------------------------------------------------------------------
| Create Consultation
|--------------------------------------------------------------------------
*/
router.post(

    '/',

    authMiddleware,

    authorizeRoles(
        'DOCTOR',
    ),

    createConsultation,
);

/*
|--------------------------------------------------------------------------
| Get All Consultations
|--------------------------------------------------------------------------
*/
router.get(

    '/',

    authMiddleware,

    getConsultations,
);
/*
|--------------------------------------------------------------------------
| Download Prescription PDF
|--------------------------------------------------------------------------
*/
router.get(

    '/pdf/:consultationId',

    authMiddleware,

    downloadPrescriptionPdf,
);

/*
|--------------------------------------------------------------------------
| Get Consultation By Appointment
|--------------------------------------------------------------------------
*/
router.get(

    '/appointment/:appointmentId',

    authMiddleware,

    getConsultationByAppointment,
);


/*
|--------------------------------------------------------------------------
| Update Consultation
|--------------------------------------------------------------------------
*/
router.put(

    '/:id',

    authMiddleware,

    authorizeRoles(
        'DOCTOR',
    ),

    updateConsultation,
);

module.exports =
router;