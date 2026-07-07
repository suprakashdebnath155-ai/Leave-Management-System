const { db } = require("../config/firebase");

const serializeDocs = (snapshot) =>
  snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

const createLeaveRequest = async (leaveData) => {
  const docRef = await db.collection("leaveRequests").add({
    ...leaveData,
    status: "pending",
    reportingStatus: "pending",
    reviewingStatus: "pending",
    approvingStatus: "pending",
    approvalHistory: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return docRef.id;
};

const getMyLeaveRequests = async (employeeId) => {
  const snapshot = await db
    .collection("leaveRequests")
    .where("employeeId", "==", employeeId)
    .get();
  return serializeDocs(snapshot).sort(
    (a, b) =>
      (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)
  );
};

const getAllLeaveRequests = async (filters = {}) => {
  const snapshot = await db
    .collection("leaveRequests")
    .orderBy("createdAt", "desc")
    .get();
  let leaves = serializeDocs(snapshot);
  if (filters.employeeId) {
    leaves = leaves.filter((leave) => leave.employeeId === filters.employeeId);
  }
  if (filters.department) {
    leaves = leaves.filter((leave) => leave.department === filters.department);
  }
  if (filters.leaveType) {
    leaves = leaves.filter((leave) => leave.leaveType === filters.leaveType);
  }
  if (filters.status) {
    leaves = leaves.filter((leave) => leave.status === filters.status);
  }
  if (filters.startDate) {
    leaves = leaves.filter((leave) => leave.endDate >= filters.startDate);
  }
  if (filters.endDate) {
    leaves = leaves.filter((leave) => leave.startDate <= filters.endDate);
  }
  return leaves;
};

const filterPendingForStage = (leaves, stage, officerId) => {
  const statusField = `${stage}Status`;
  const officerField =
    stage === "reporting"
      ? "reportingOfficerId"
      : stage === "reviewing"
        ? "reviewingOfficerId"
        : "approvingAuthorityId";
  return leaves.filter((leave) => {
    if (leave.status === "cancelled" || leave[statusField] !== "pending") {
      return false;
    }
    if (stage === "reviewing" && leave.reportingStatus !== "recommended") {
      return false;
    }
    if (stage === "approving" && leave.reviewingStatus !== "recommended") {
      return false;
    }
    return !leave[officerField] || leave[officerField] === officerId;
  });
};

const getPendingForStage = async (stage, officerId) => {
  const leaves = await getAllLeaveRequests();
  return filterPendingForStage(leaves, stage, officerId);
};

const getLeaveById = async (leaveId) => {
  const doc = await db.collection("leaveRequests").doc(leaveId).get();
  if (!doc.exists) throw new Error("Leave request not found");
  return { id: doc.id, ...doc.data() };
};

const hasOverlappingLeave = async (employeeId, startDate, endDate) => {
  const leaves = await getMyLeaveRequests(employeeId);
  return leaves.some(
    (leave) =>
      leave.status !== "cancelled" &&
      leave.status !== "rejected" &&
      startDate <= leave.endDate &&
      endDate >= leave.startDate
  );
};

const recordDecision = async ({
  leaveId,
  stage,
  decision,
  remark,
  officerId,
}) => {
  const ref = db.collection("leaveRequests").doc(leaveId);
  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(ref);
    if (!doc.exists) throw new Error("Leave request not found");
    const leave = doc.data();
    if (leave.status === "cancelled") throw new Error("Leave is cancelled");
    const field = `${stage}Status`;
    if (leave[field] !== "pending") throw new Error("Leave was already reviewed");
    if (stage === "reviewing" && leave.reportingStatus !== "recommended") {
      throw new Error("Reporting Officer recommendation is required");
    }
    if (stage === "approving" && leave.reviewingStatus !== "recommended") {
      throw new Error("Reviewing Officer recommendation is required");
    }
    const now = new Date();
    const rejected = decision === "rejected";
    const final = stage === "approving" && decision === "approved";
    transaction.update(ref, {
      [field]: decision,
      [`${stage}Remark`]: remark || "",
      [`${stage}ReviewedAt`]: now,
      status: rejected ? "rejected" : final ? "approved" : "pending",
      approvalHistory: [
        ...(leave.approvalHistory || []),
        { stage, decision, remark: remark || "", officerId, createdAt: now },
      ],
      updatedAt: now,
    });
  });
};

const cancelLeaveRequest = async (leaveId, employeeId) => {
  const ref = db.collection("leaveRequests").doc(leaveId);
  let previousStatus;
  let leaveData;
  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(ref);
    if (!doc.exists) throw new Error("Leave request not found");
    const leave = doc.data();
    if (leave.employeeId !== employeeId) throw new Error("Access denied");
    if (["cancelled", "rejected"].includes(leave.status)) {
      throw new Error("This leave cannot be cancelled");
    }
    if (leave.status === "approved" && leave.startDate < new Date().toISOString().slice(0, 10)) {
      throw new Error("Past or active approved leave cannot be cancelled");
    }
    previousStatus = leave.status;
    leaveData = leave;
    transaction.update(ref, {
      status: "cancelled",
      cancelledAt: new Date(),
      updatedAt: new Date(),
    });
  });
  return { previousStatus, leave: leaveData };
};

module.exports = {
  createLeaveRequest,
  getMyLeaveRequests,
  getAllLeaveRequests,
  filterPendingForStage,
  getPendingForStage,
  getLeaveById,
  hasOverlappingLeave,
  recordDecision,
  cancelLeaveRequest,
};
