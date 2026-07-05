const express = require("express");

const {
  verifyToken,
} = require("../middleware/authMiddleware");

const {
  getNotifications,
  readNotification,
  readAllNotifications,
  removeNotification,
} = require("../controllers/notificationController");

const router = express.Router();

// Get My Notifications
router.get(
  "/my",
  verifyToken,
  getNotifications
);

// Mark One Notification as Read
router.patch(
  "/:id/read",
  verifyToken,
  readNotification
);

// Mark All Notifications as Read
router.patch(
  "/read-all",
  verifyToken,
  readAllNotifications
);

// Delete Notification
router.delete(
  "/:id",
  verifyToken,
  removeNotification
);

module.exports = router;