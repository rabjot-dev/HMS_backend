const express = require("express");

const router = express.Router();

const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
} = require("../controllers/patient.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const validateMiddleware = require("../middleware/validate.middleware");

const {
  createPatientValidation,
  updatePatientValidation,
} = require("../validations/patient.validation");

/*
|--------------------------------------------------------------------------
| Register Patient
|--------------------------------------------------------------------------
*/
router.post(
  "/",

  authMiddleware,

  roleMiddleware("ADMIN", "RECEPTIONIST"),

  createPatientValidation,

  validateMiddleware,

  createPatient,
);

/*
|--------------------------------------------------------------------------
| Get All Patients
|--------------------------------------------------------------------------
*/
router.get(
  "/",

  authMiddleware,

  getPatients,
);

/*
|--------------------------------------------------------------------------
| Get Patient By ID
|--------------------------------------------------------------------------
*/
router.get(
  "/:id",

  authMiddleware,

  getPatientById,
);

/*
|--------------------------------------------------------------------------
| Update Patient
|--------------------------------------------------------------------------
*/
router.put(
  "/:id",

  authMiddleware,

  roleMiddleware("ADMIN", "RECEPTIONIST"),

  updatePatientValidation,

  validateMiddleware,

  updatePatient,
);

module.exports = router;
