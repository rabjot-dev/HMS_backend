const mongoose =
require(
    'mongoose',
);

/*
|--------------------------------------------------------------------------
| Prescription Schema
|--------------------------------------------------------------------------
*/
const prescriptionSchema =
new mongoose.Schema({

    medicineName: {

        type: String,

        required: true,
    },

    dosage: {

        type: String,

        required: true,
    },

    frequency: {

        type: String,

        required: true,
    },

    duration: {

        type: String,

        required: true,
    },
});

/*
|--------------------------------------------------------------------------
| Consultation Schema
|--------------------------------------------------------------------------
*/
const consultationSchema =
new mongoose.Schema(

    {

        /*
        |--------------------------------------------------------------------------
        | Appointment
        |--------------------------------------------------------------------------
        */
        appointmentId: {

            type:
            mongoose.Schema
            .Types.ObjectId,

            ref:
            'Appointment',

            required:
            true,
        },

        /*
        |--------------------------------------------------------------------------
        | Patient
        |--------------------------------------------------------------------------
        */
        patientId: {

            type:
            mongoose.Schema
            .Types.ObjectId,

            ref:
            'Patient',

            required:
            true,
        },

        /*
        |--------------------------------------------------------------------------
        | Doctor
        |--------------------------------------------------------------------------
        */
        doctorEmployeeId: {

            type:
            mongoose.Schema
            .Types.ObjectId,

            ref:
            'Employee',

            required:
            true,
        },

        /*
        |--------------------------------------------------------------------------
        | Diagnosis
        |--------------------------------------------------------------------------
        */
        diagnosis: {

            type:
            String,

            trim:
            true,
        },

        /*
        |--------------------------------------------------------------------------
        | Symptoms
        |--------------------------------------------------------------------------
        */
        symptoms: [

            {
                type:
                String,
            },
        ],

        /*
        |--------------------------------------------------------------------------
        | Doctor Notes
        |--------------------------------------------------------------------------
        */
        doctorNotes: {

            type:
            String,

            trim:
            true,
        },

        /*
        |--------------------------------------------------------------------------
        | Vitals
        |--------------------------------------------------------------------------
        */
        vitals: {

            bloodPressure: {

                type:
                String,
            },

            pulseRate: {

                type:
                Number,
            },

            oxygenLevel: {

                type:
                Number,
            },

            temperature: {

                type:
                Number,
            },

            weight: {

                type:
                Number,
            },
        },

        /*
        |--------------------------------------------------------------------------
        | Prescription
        |--------------------------------------------------------------------------
        */
        prescriptions: [

            prescriptionSchema,
        ],

        /*
        |--------------------------------------------------------------------------
        | Consultation Status
        |--------------------------------------------------------------------------
        */
        status: {

            type:
            String,

            enum: [

                'IN_PROGRESS',

                'COMPLETED',
            ],

            default:
            'IN_PROGRESS',
        },
    },

    {

        timestamps:
        true,

        versionKey:
        false,
    },
);

const Consultation =
mongoose.model(

    'Consultation',

    consultationSchema,
);

module.exports =
Consultation;