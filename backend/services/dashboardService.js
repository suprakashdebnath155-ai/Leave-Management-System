const { db } = require("../config/firebase");

const getEmployeeDashboard = async (
  employeeId
) => {
  const today = new Date()
    .toISOString()
    .split("T")[0];

  const [profileDoc, balanceDoc, leaveSnapshot, holidaySnapshot] =
    await Promise.all([
      db
        .collection("users")
        .doc(employeeId)
        .get(),
      db
        .collection("leaveBalances")
        .doc(employeeId)
        .get(),
      db
        .collection("leaveRequests")
        .where(
          "employeeId",
          "==",
          employeeId
        )
        .get(),
      db
        .collection("holidays")
        .where(
          "date",
          ">=",
          today
        )
        .orderBy("date")
        .limit(5)
        .get(),
    ]);

  if (!profileDoc.exists) {
    throw new Error(
      "Employee not found"
    );
  }

  const profile = profileDoc.data();

  const leaveBalance = balanceDoc.exists
    ? balanceDoc.data()
    : {};

  const allLeaves =
    leaveSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })).sort(
      (a, b) =>
        (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)
    );
  const recentLeaves = allLeaves.slice(0, 5);

  // Dashboard Summary
  const summary = {
    totalApplied: allLeaves.length,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
  };

  allLeaves.forEach((leave) => {
    if (
      leave.status ===
      "cancelled"
    ) {
      summary.cancelled++;
    } else if (
      leave.approvingStatus ===
      "approved"
    ) {
      summary.approved++;
    } else if (
      leave.approvingStatus ===
      "rejected"
    ) {
      summary.rejected++;
    } else {
      summary.pending++;
    }
  });

  const upcomingHolidays =
    holidaySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

  return {
    profile,
    leaveBalance,
    summary,
    recentLeaves,
    upcomingHolidays,
  };
};

module.exports = {
  getEmployeeDashboard,
};
