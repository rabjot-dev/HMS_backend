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

/*
|--------------------------------------------------------------------------
| Register Patient
|--------------------------------------------------------------------------
*/
router.post(
  "/",

  authMiddleware,

  roleMiddleware(
    "ADMIN",

    "RECEPTIONIST",
  ),

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

  roleMiddleware(
    "ADMIN",

    "RECEPTIONIST",
  ),

  updatePatient,
);

module.exports = router;
