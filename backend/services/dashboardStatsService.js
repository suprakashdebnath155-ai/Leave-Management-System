const { db } = require("../config/firebase");

const initializeDashboardStats = async (
  employeeId
) => {
  const statsRef = db
    .collection("dashboardStats")
    .doc(employeeId);

  const statsDoc =
    await statsRef.get();

  if (!statsDoc.exists) {
    await statsRef.set({
      employeeId,
      totalApplied: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      cancelled: 0,
      updatedAt: new Date(),
    });
  }
};

const getDashboardStats = async (
  employeeId
) => {
  const statsDoc = await db
    .collection("dashboardStats")
    .doc(employeeId)
    .get();

  if (!statsDoc.exists) {
    await initializeDashboardStats(
      employeeId
    );

    return {
      employeeId,
      totalApplied: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      cancelled: 0,
    };
  }

  return statsDoc.data();
};

const updateDashboardStats = async (
  employeeId
) => {
  const snapshot = await db
    .collection("leaveRequests")
    .where(
      "employeeId",
      "==",
      employeeId
    )
    .get();

  const stats = {
    employeeId,
    totalApplied: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
    updatedAt: new Date(),
  };

  snapshot.docs.forEach((doc) => {
    const leave = doc.data();

    stats.totalApplied++;

    if (
      leave.status === "cancelled"
    ) {
      stats.cancelled++;
    } else if (
      leave.approvingStatus ===
      "approved"
    ) {
      stats.approved++;
    } else if (
      leave.approvingStatus ===
      "rejected"
    ) {
      stats.rejected++;
    } else {
      stats.pending++;
    }
  });

  await db
    .collection("dashboardStats")
    .doc(employeeId)
    .set(stats);

  return stats;
};

module.exports = {
  initializeDashboardStats,
  getDashboardStats,
  updateDashboardStats,
};