const express = require("express");

const {
  requestPasswordReset,
  resetPassword,
} = require("../controllers/passwordController");

const router = express.Router();

// Request password reset email
router.post("/forgot", requestPasswordReset);

// Reset password using token
router.post("/reset", resetPassword);

module.exports = router;