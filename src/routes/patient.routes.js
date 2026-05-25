const express =
require(
    'express',
);

const router =
express.Router();

const {

    createPatient,

    getPatients,

    getPatientById,

    updatePatient,

} = require(

    '../controllers/patient.controller',
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
| Register Patient
|--------------------------------------------------------------------------
*/
router.post(

    '/',

    authMiddleware,

    authorizeRoles(

        'ADMIN',

        'RECEPTIONIST',
    ),

    createPatient,
);

/*
|--------------------------------------------------------------------------
| Get All Patients
|--------------------------------------------------------------------------
*/
router.get(

    '/',

    authMiddleware,

    getPatients,
);

/*
|--------------------------------------------------------------------------
| Get Patient By ID
|--------------------------------------------------------------------------
*/
router.get(

    '/:id',

    authMiddleware,

    getPatientById,
);

/*
|--------------------------------------------------------------------------
| Update Patient
|--------------------------------------------------------------------------
*/
router.put(

    '/:id',

    authMiddleware,

    authorizeRoles(

        'ADMIN',

        'RECEPTIONIST',
    ),

    updatePatient,
);

module.exports =
router;