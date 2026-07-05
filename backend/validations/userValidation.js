const { body, validationResult } = require("express-validator");

const validateCreateUser = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("role")
    .notEmpty()
    .withMessage("Role is required"),

  body("department")
    .notEmpty()
    .withMessage("Department is required"),

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
  validateCreateUser,
};