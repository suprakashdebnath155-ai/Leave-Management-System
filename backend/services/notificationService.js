const { db } = require("../config/firebase");

const createNotification = async ({
  userId,
  title,
  message,
  type = "info",
}) => {
  const notification = {
    userId,
    title,
    message,
    type,
    isRead: false,
    createdAt: new Date(),
  };

  const docRef = await db
    .collection("notifications")
    .add(notification);

  return {
    id: docRef.id,
    ...notification,
  };
};

const getMyNotifications = async (
  userId
) => {
  const snapshot = await db
    .collection("notifications")
    .where("userId", "==", userId)
    .get();

  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .sort(
      (a, b) =>
        (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)
    );
};

const markAsRead = async (
  notificationId,
  userId
) => {
  const docRef = db
    .collection("notifications")
    .doc(notificationId);

  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error(
      "Notification not found"
    );
  }

  if (doc.data().userId !== userId) {
    throw new Error("Access denied");
  }

  await docRef.update({
    isRead: true,
  });

  return true;
};

const markAllAsRead = async (
  userId
) => {
  const snapshot = await db
    .collection("notifications")
    .where("userId", "==", userId)
    .where("isRead", "==", false)
    .get();

  const batch = db.batch();

  snapshot.docs.forEach((doc) => {
    batch.update(doc.ref, {
      isRead: true,
    });
  });

  await batch.commit();

  return true;
};

const deleteNotification = async (
  notificationId,
  userId
) => {
  const docRef = db
    .collection("notifications")
    .doc(notificationId);

  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error(
      "Notification not found"
    );
  }

  if (doc.data().userId !== userId) {
    throw new Error("Access denied");
  }

  await docRef.delete();

  return true;
};

module.exports = {
  createNotification,
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
