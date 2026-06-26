const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const ROLES = require("../constants/roles");

const {
  getIndiaStates,
  getIndiaDistricts,
  getIndiaPincodes,
  getIndiaPostOfficeAreas,
  getIndiaTaluks,
} = require("../controllers/location.controller");

const router = express.Router();

router.get(
  "/india/states",
  authMiddleware,
  roleMiddleware(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.RECEPTIONIST),
  getIndiaStates,
);

router.get(
  "/india/states/:stateId/districts",
  authMiddleware,
  roleMiddleware(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.RECEPTIONIST),
  getIndiaDistricts,
);

router.get(
  "/india/pincodes",
  authMiddleware,
  roleMiddleware(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.RECEPTIONIST),
  getIndiaPincodes,
);

router.get(
  "/india/taluks",
  authMiddleware,
  roleMiddleware(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.RECEPTIONIST),
  getIndiaTaluks,
);

router.get(
  "/india/post-offices",
  authMiddleware,
  roleMiddleware(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.RECEPTIONIST),
  getIndiaPostOfficeAreas,
);

module.exports = router;
 