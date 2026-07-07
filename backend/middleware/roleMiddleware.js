const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    try {
      const { getUserProfile } = require("../services/authService");
      const user = await getUserProfile(req.user.uid);

      if (user.isActive === false) {
        return res.status(403).json({
          success: false,
          message: "Your account is inactive. Contact an administrator.",
        });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      req.profile = user;

      next();
    } catch (error) {
      if (error.message === "User not found") {
        return res.status(404).json({
          success: false,
          message: "User profile not found",
        });
      }

      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };
};

module.exports = {
  authorizeRoles,
};
