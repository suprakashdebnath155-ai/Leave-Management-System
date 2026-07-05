const { db } = require("../config/firebase");

const FIELD_BY_TYPE = {
  "Casual Leave": "casualLeaveBalance",
  "Medical Leave": "medicalLeave",
  "Earned Leave": "earnedLeave",
  "Half Pay Leave": "halfPayLeave",
  "Duty Leave": "dutyLeave",
};

const createLeaveBalance = async (employeeId, jobMode) => {
  const now = new Date();
  const isRegular = jobMode === "Regular";
  const balance = {
    employeeId,
    medicalLeave: 90,
    casualLeaveBalance: 2,
    casualLeaveMonth: now.getMonth() + 1,
    casualLeaveYear: now.getFullYear(),
    earnedLeave: isRegular ? 12 : 0,
    halfPayLeave: isRegular ? 12 : 0,
    dutyLeave: isRegular ? 10 : 0,
    earnedLeaveYear: now.getFullYear(),
    updatedAt: now,
  };
  await db.collection("leaveBalances").doc(employeeId).set(balance);
  return balance;
};

const refreshAccruals = async (employeeId) => {
  const ref = db.collection("leaveBalances").doc(employeeId);
  const doc = await ref.get();
  if (!doc.exists) throw new Error("Leave balance not found");
  const balance = doc.data();
  const now = new Date();
  const updates = {};

  if (
    balance.casualLeaveMonth !== now.getMonth() + 1 ||
    balance.casualLeaveYear !== now.getFullYear()
  ) {
    updates.casualLeaveBalance = 2;
    updates.casualLeaveMonth = now.getMonth() + 1;
    updates.casualLeaveYear = now.getFullYear();
  }
  if (balance.earnedLeaveYear !== now.getFullYear()) {
    updates.earnedLeave = 12;
    updates.earnedLeaveYear = now.getFullYear();
  }
  if (Object.keys(updates).length) {
    updates.updatedAt = now;
    await ref.update(updates);
    await db.collection("balanceHistory").add({
      employeeId,
      action: "ACCRUAL_REFRESH",
      changes: updates,
      createdAt: now,
    });
  }
  return { ...balance, ...updates };
};

const resetMonthlyCasualLeave = refreshAccruals;
const resetYearlyEarnedLeave = refreshAccruals;

const getLeaveBalance = async (employeeId) => {
  await refreshAccruals(employeeId);
  const doc = await db.collection("leaveBalances").doc(employeeId).get();
  if (!doc.exists) throw new Error("Leave balance not found");
  return doc.data();
};

const checkLeaveBalance = async (employeeId, leaveType, daysRequested) => {
  const field = FIELD_BY_TYPE[leaveType];
  if (!field) return false;
  const balance = await getLeaveBalance(employeeId);
  return Number(balance[field] || 0) >= Number(daysRequested);
};

const changeLeaveBalance = async ({
  employeeId,
  leaveType,
  days,
  direction,
  leaveId,
}) => {
  const field = FIELD_BY_TYPE[leaveType];
  if (!field) throw new Error("Invalid leave type");
  const ref = db.collection("leaveBalances").doc(employeeId);

  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(ref);
    if (!doc.exists) throw new Error("Leave balance not found");
    const current = Number(doc.data()[field] || 0);
    const next = current + direction * Number(days);
    if (next < 0) throw new Error("Insufficient leave balance");
    transaction.update(ref, { [field]: next, updatedAt: new Date() });
  });

  await db.collection("balanceHistory").add({
    employeeId,
    leaveId: leaveId || null,
    leaveType,
    days: Number(days),
    action: direction < 0 ? "DEDUCTED" : "RESTORED",
    createdAt: new Date(),
  });
};

const deductLeaveBalance = (employeeId, leaveType, days, leaveId) =>
  changeLeaveBalance({
    employeeId,
    leaveType,
    days,
    direction: -1,
    leaveId,
  });

const restoreLeaveBalance = (employeeId, leaveType, days, leaveId) =>
  changeLeaveBalance({
    employeeId,
    leaveType,
    days,
    direction: 1,
    leaveId,
  });

const getBalanceHistory = async (employeeId) => {
  const snapshot = await db
    .collection("balanceHistory")
    .where("employeeId", "==", employeeId)
    .get();
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .sort(
      (a, b) =>
        (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)
    );
};

module.exports = {
  createLeaveBalance,
  getLeaveBalance,
  resetMonthlyCasualLeave,
  resetYearlyEarnedLeave,
  checkLeaveBalance,
  deductLeaveBalance,
  restoreLeaveBalance,
  getBalanceHistory,
};
