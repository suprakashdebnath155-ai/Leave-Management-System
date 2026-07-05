const { body } = require("express-validator");
const { validateRequest } = require("../middleware/validateRequest");

const LEAVE_TYPES = [
  "Casual Leave",
  "Medical Leave",
  "Earned Leave",
  "Half Pay Leave",
  "Duty Leave",
];

const validateLeaveApplication = [
  body("leaveType").isIn(LEAVE_TYPES).withMessage("Select a valid leave type"),
  body("startDate").isISO8601({ strict: true }).withMessage("Valid start date required"),
  body("endDate").isISO8601({ strict: true }).withMessage("Valid end date required"),
  body("reason")
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("Reason must be between 10 and 500 characters"),
  body("halfDay").optional().isBoolean(),
  body("emergency").optional().isBoolean(),
  body("attachmentUrl").optional({ checkFalsy: true }).isURL(),
  validateRequest,
];

const validateDecision = [
  body("decision")
    .isIn(["recommended", "rejected", "approved"])
    .withMessage("Invalid decision"),
  body("remark").optional().trim().isLength({ max: 500 }),
  validateRequest,
];

module.exports = { validateLeaveApplication, validateDecision, LEAVE_TYPES };
