
const express = require("express");
const router = express.Router();

const {
  getAllSignupRequests,
  getPendingSignupRequests,
  approveSignupRequest,
  rejectSignupRequest,
} = require("../controllers/employeeSignupController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getAllSignupRequests
);

router.get(
  "/pending",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getPendingSignupRequests
);

router.post(
  "/:id/approve",
  authMiddleware,
  roleMiddleware("ADMIN"),
  approveSignupRequest
);

router.post(
  "/:id/reject",
  authMiddleware,
  roleMiddleware("ADMIN"),
  rejectSignupRequest
);

module.exports = router;