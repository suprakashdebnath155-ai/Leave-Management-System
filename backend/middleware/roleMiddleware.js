const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    try {
      const { db } = require("../config/firebase");

      const userDoc = await db
        .collection("users")
        .doc(req.user.uid)
        .get();

      if (!userDoc.exists) {
        return res.status(404).json({
          success: false,
          message: "User profile not found",
        });
      }

      const user = userDoc.data();

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
