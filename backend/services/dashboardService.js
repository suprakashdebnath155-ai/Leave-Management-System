const { db } = require("../config/firebase");

const getEmployeeDashboard = async (
  employeeId
) => {
  // Employee Profile
  const profileDoc = await db
    .collection("users")
    .doc(employeeId)
    .get();

  if (!profileDoc.exists) {
    throw new Error(
      "Employee not found"
    );
  }

  const profile = profileDoc.data();

  // Leave Balance
  const balanceDoc = await db
    .collection("leaveBalances")
    .doc(employeeId)
    .get();

  const leaveBalance = balanceDoc.exists
    ? balanceDoc.data()
    : {};

  // Latest 5 Leave Requests
  const leaveSnapshot = await db
    .collection("leaveRequests")
    .where(
      "employeeId",
      "==",
      employeeId
    )
    .get();

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

  // Today's Date
  const today = new Date()
    .toISOString()
    .split("T")[0];

  // Upcoming Holidays
  const holidaySnapshot = await db
    .collection("holidays")
    .where(
      "date",
      ">=",
      today
    )
    .orderBy("date")
    .limit(5)
    .get();

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
