const { db } = require("../config/firebase");
const { getHolidayDates } = require("./holidayService");

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
    if (
  ["cancelled", "rejected", "approved", "revoked"].includes(leave.status) ||
  leave[statusField] !== "pending"
) {
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
    !["cancelled", "rejected", "revoked"].includes(leave.status) &&
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
    if (["cancelled", "rejected", "approved", "revoked"].includes(leave.status)) {
        throw new Error(`Your Leave Request has been  ${leave.status}`);
    }
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

const calculateElapsedWorkingDays = (createdAt, holidayDates) => {
  if (!createdAt) {
    return 0;
  }

  const submittedDate =
    typeof createdAt.toDate === "function"
      ? createdAt.toDate()
      : new Date(createdAt);

  const currentDate = new Date();

  // Normalize both dates to midnight
  submittedDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  let workingDays = 0;

  // Start counting from the day after submission
  const date = new Date(submittedDate);
  date.setDate(date.getDate() + 1);

  while (date < currentDate) {
    const dayOfWeek = date.getDay();

    const dateString = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const holiday = holidayDates.has(dateString);

    if (!isWeekend && !holiday) {
      workingDays++;
    }

    date.setDate(date.getDate() + 1);
  }

  return workingDays;
};

const revokeExpiredLeaveRequests = async () => {
  const holidayDates = await getHolidayDates();

  const snapshot = await db
    .collection("leaveRequests")
    .where("status", "==", "pending")
    .get();

  if (snapshot.empty) {
    return {
      revokedCount: 0,
      revokedLeaves: [],
    };
  }

  const revokedLeaves = [];

  for (const doc of snapshot.docs) {
    const leave = doc.data();

    const elapsedWorkingDays = calculateElapsedWorkingDays(
      leave.createdAt,
      holidayDates
    );

    if (elapsedWorkingDays >= 3) {
      const now = new Date();

      await doc.ref.update({
        status: "revoked",
        revokedAt: now,
        revokedReason:
          "Automatically revoked after remaining pending for more than 3 working days.",
        updatedAt: now,
      });

      revokedLeaves.push({
        id: doc.id,
        ...leave,
        status: "revoked",
        revokedAt: now,
        elapsedWorkingDays,
      });
    }
  }

  return {
    revokedCount: revokedLeaves.length,
    revokedLeaves,
  };
};

const clearAllLeaveRequests = async () => {
  const snapshot = await db.collection("leaveRequests").get();

  if (snapshot.empty) {
    return {
      deletedCount: 0,
    };
  }

  const docs = snapshot.docs;
  let deletedCount = 0;

  // Firestore allows up to 500 operations per batch
  for (let i = 0; i < docs.length; i += 500) {
    const batch = db.batch();
    const chunk = docs.slice(i, i + 500);

    chunk.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    deletedCount += chunk.length;
  }

  return {
    deletedCount,
  };
};

module.exports = {
  createLeaveRequest,
  getMyLeaveRequests,
  getAllLeaveRequests,
  getPendingForStage,
  getLeaveById,
  hasOverlappingLeave,
  recordDecision,
  cancelLeaveRequest,
  clearAllLeaveRequests,
  revokeExpiredLeaveRequests,
};