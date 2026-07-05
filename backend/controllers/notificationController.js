const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../services/notificationService");

// Get My Notifications
const getNotifications = async (
  req,
  res
) => {
  try {
    const notifications =
      await getMyNotifications(
        req.user.uid
      );

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Mark Single Notification as Read
const readNotification = async (
  req,
  res
) => {
  try {
    await markAsRead(
      req.params.id,
      req.user.uid
    );

    res.status(200).json({
      success: true,
      message:
        "Notification marked as read",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Mark All Notifications as Read
const readAllNotifications =
  async (req, res) => {
    try {
      await markAllAsRead(
        req.user.uid
      );

      res.status(200).json({
        success: true,
        message:
          "All notifications marked as read",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };

// Delete Notification
const removeNotification =
  async (req, res) => {
    try {
      await deleteNotification(
        req.params.id,
        req.user.uid
      );

      res.status(200).json({
        success: true,
        message:
          "Notification deleted",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  };

module.exports = {
  getNotifications,
  readNotification,
  readAllNotifications,
  removeNotification,
};