const { body, validationResult } = require("express-validator");

const validateCreateEmployee = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("role")
    .isIn([
      "admin",
      "employee",
      "reportingOfficer",
      "reviewingOfficer",
      "approvingAuthority",
    ])
    .withMessage("Valid role is required"),

  body("department")
    .notEmpty()
    .withMessage("Department is required"),

  body("jobMode")
    .notEmpty()
    .withMessage("Job Mode is required"),

  body("dateOfJoining")
    .notEmpty()
    .withMessage("Date of Joining is required"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    next();
  },
];

module.exports = {
  validateCreateEmployee,
};
