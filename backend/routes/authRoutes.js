const express = require("express");

const router = express.Router();

const {
  createEmployeeAccount,
  loginUser,
  getMyProfile,
  updateMyProfile,
  adminOnly,
} = require("../controllers/authController");

const {
  validateCreateEmployee,
} = require("../validations/authValidation");

const {
  verifyToken,
} = require("../middleware/authMiddleware");

const {
  authorizeRoles,
} = require("../middleware/roleMiddleware");

// Create Employee
router.post(
  "/create-employee",
  verifyToken,
  authorizeRoles("admin"),
  validateCreateEmployee,
  createEmployeeAccount
);

// Login
router.post(
  "/login",
  loginUser
);

// Get My Profile
router.get(
  "/me",
  verifyToken,
  getMyProfile
);
router.patch("/me", verifyToken, updateMyProfile);

// Admin Only
router.get(
  "/admin",
  verifyToken,
  authorizeRoles("admin"),
  adminOnly
);


module.exports = router;
