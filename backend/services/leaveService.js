const { db } = require("../config/firebase");
const { getHolidayDates } = require("./holidayService");

/* =========================================================
   HELPER: SERIALIZE FIRESTORE DOCUMENTS
========================================================= */

const serializeDocs = (snapshot) =>
  snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

/* =========================================================
   CREATE LEAVE REQUEST
========================================================= */

const createLeaveRequest = async (leaveData) => {
  const now = new Date();

  const docRef = await db.collection("leaveRequests").add({
    ...leaveData,

    // Overall leave status
    status: "pending",

    // Individual workflow stages
    reportingStatus: "pending",
    reviewingStatus: "pending",
    approvingStatus: "pending",

    // Remarks
    reportingRemark: "",
    reviewingRemark: "",
    approvingRemark: "",

    // Complete history of decisions
    approvalHistory: [],

    createdAt: now,
    updatedAt: now,
  });

  return docRef.id;
};

/* =========================================================
   GET EMPLOYEE'S OWN LEAVE REQUESTS
========================================================= */

const getMyLeaveRequests = async (employeeId) => {
  const snapshot = await db
    .collection("leaveRequests")
    .where("employeeId", "==", employeeId)
    .get();

  return serializeDocs(snapshot).sort(
    (a, b) =>
      (b.createdAt?.toMillis?.() || 0) -
      (a.createdAt?.toMillis?.() || 0)
  );
};

/* =========================================================
   GET ALL LEAVE REQUESTS
========================================================= */

const getAllLeaveRequests = async (filters = {}) => {
  const snapshot = await db
    .collection("leaveRequests")
    .orderBy("createdAt", "desc")
    .get();

  let leaves = serializeDocs(snapshot);

  if (filters.employeeId) {
    leaves = leaves.filter(
      (leave) => leave.employeeId === filters.employeeId
    );
  }

  if (filters.department) {
    leaves = leaves.filter(
      (leave) => leave.department === filters.department
    );
  }

  if (filters.leaveType) {
    leaves = leaves.filter(
      (leave) => leave.leaveType === filters.leaveType
    );
  }

  if (filters.status) {
    leaves = leaves.filter(
      (leave) => leave.status === filters.status
    );
  }

  if (filters.startDate) {
    leaves = leaves.filter(
      (leave) => leave.endDate >= filters.startDate
    );
  }

  if (filters.endDate) {
    leaves = leaves.filter(
      (leave) => leave.startDate <= filters.endDate
    );
  }

  return leaves;
};

/* =========================================================
   FILTER PENDING REQUESTS FOR EACH WORKFLOW STAGE
========================================================= */

const filterPendingForStage = (leaves, stage, officerId) => {
  const validStages = [
    "reporting",
    "reviewing",
    "approving",
  ];

  if (!validStages.includes(stage)) {
    throw new Error(`Invalid leave workflow stage: ${stage}`);
  }

  const statusField = `${stage}Status`;

  const officerField =
    stage === "reporting"
      ? "reportingOfficerId"
      : stage === "reviewing"
        ? "reviewingOfficerId"
        : "approvingAuthorityId";

  return leaves.filter((leave) => {
    // Only globally pending requests can enter the workflow
    if (leave.status !== "pending") {
      return false;
    }

    // This particular stage must still be pending
    if (leave[statusField] !== "pending") {
      return false;
    }

    // Reviewing Officer can see the request only after
    // Reporting Officer recommends it
    if (
      stage === "reviewing" &&
      leave.reportingStatus !== "recommended"
    ) {
      return false;
    }

    // Approving Authority can see the request only after
    // Reviewing Officer recommends it
    if (
      stage === "approving" &&
      leave.reviewingStatus !== "recommended"
    ) {
      return false;
    }

    // If a particular officer is assigned, only that officer
    // can see and process the request
    return (
      !leave[officerField] ||
      leave[officerField] === officerId
    );
  });
};

/* =========================================================
   GET PENDING REQUESTS FOR A PARTICULAR STAGE
========================================================= */

const getPendingForStage = async (stage, officerId) => {
  const leaves = await getAllLeaveRequests();

  return filterPendingForStage(
    leaves,
    stage,
    officerId
  );
};

/* =========================================================
   GET SINGLE LEAVE REQUEST
========================================================= */

const getLeaveById = async (leaveId) => {
  const doc = await db
    .collection("leaveRequests")
    .doc(leaveId)
    .get();

  if (!doc.exists) {
    throw new Error("Leave request not found");
  }

  return {
    id: doc.id,
    ...doc.data(),
  };
};

/* =========================================================
   CHECK FOR OVERLAPPING LEAVE
========================================================= */

const hasOverlappingLeave = async (
  employeeId,
  startDate,
  endDate
) => {
  const leaves = await getMyLeaveRequests(employeeId);

  return leaves.some(
    (leave) =>
      ![
        "cancelled",
        "rejected",
        "revoked",
      ].includes(leave.status) &&
      startDate <= leave.endDate &&
      endDate >= leave.startDate
  );
};

/* =========================================================
   RECORD OFFICER DECISION

   Reporting Officer:
     recommended / rejected

   Reviewing Officer:
     recommended / rejected

   Approving Authority:
     approved / rejected
========================================================= */

const recordDecision = async ({
  leaveId,
  stage,
  decision,
  remark,
  officerId,
}) => {
  const validStages = [
    "reporting",
    "reviewing",
    "approving",
  ];

  if (!validStages.includes(stage)) {
    throw new Error("Invalid leave workflow stage");
  }

  const allowedDecisions = {
    reporting: ["recommended", "rejected"],
    reviewing: ["recommended", "rejected"],
    approving: ["approved", "rejected"],
  };

  if (!allowedDecisions[stage].includes(decision)) {
    throw new Error(
      `Invalid decision "${decision}" for ${stage} stage`
    );
  }

  const ref = db
    .collection("leaveRequests")
    .doc(leaveId);

  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(ref);

    if (!doc.exists) {
      throw new Error("Leave request not found");
    }

    const leave = doc.data();

    /* -----------------------------------------------------
       Prevent processing completed/cancelled requests
    ----------------------------------------------------- */

    if (
      [
        "cancelled",
        "rejected",
        "approved",
        "revoked",
      ].includes(leave.status)
    ) {
      throw new Error(
        `This leave request has already been ${leave.status}.`
      );
    }

    /* -----------------------------------------------------
       Determine current status field
    ----------------------------------------------------- */

    const statusField = `${stage}Status`;

    if (leave[statusField] !== "pending") {
      throw new Error(
        `This leave request was already processed by the ${stage} stage.`
      );
    }

    /* -----------------------------------------------------
       Verify correct workflow order
    ----------------------------------------------------- */

    if (
      stage === "reviewing" &&
      leave.reportingStatus !== "recommended"
    ) {
      throw new Error(
        "Reporting Officer recommendation is required before Reviewing Officer action."
      );
    }

    if (
      stage === "approving" &&
      leave.reviewingStatus !== "recommended"
    ) {
      throw new Error(
        "Reviewing Officer recommendation is required before Approving Authority action."
      );
    }

    /* -----------------------------------------------------
       Verify assigned officer
    ----------------------------------------------------- */

    const officerField =
      stage === "reporting"
        ? "reportingOfficerId"
        : stage === "reviewing"
          ? "reviewingOfficerId"
          : "approvingAuthorityId";

    if (
      leave[officerField] &&
      leave[officerField] !== officerId
    ) {
      throw new Error(
        "You are not authorized to process this leave request."
      );
    }

    const now = new Date();

    const isRejected = decision === "rejected";

    const isFinallyApproved =
      stage === "approving" &&
      decision === "approved";

    let overallStatus = "pending";

    if (isRejected) {
      overallStatus = "rejected";
    } else if (isFinallyApproved) {
      overallStatus = "approved";
    }

    /* -----------------------------------------------------
       Save decision
    ----------------------------------------------------- */

    transaction.update(ref, {
      [statusField]: decision,

      [`${stage}Remark`]: remark || "",

      [`${stage}ReviewedAt`]: now,

      status: overallStatus,

      approvalHistory: [
        ...(leave.approvalHistory || []),
        {
          stage,
          decision,
          remark: remark || "",
          officerId,
          createdAt: now,
        },
      ],

      updatedAt: now,
    });
  });

  return getLeaveById(leaveId);
};

/* =========================================================
   CANCEL LEAVE REQUEST
========================================================= */

const cancelLeaveRequest = async (
  leaveId,
  employeeId
) => {
  const ref = db
    .collection("leaveRequests")
    .doc(leaveId);

  let previousStatus;
  let leaveData;

  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(ref);

    if (!doc.exists) {
      throw new Error("Leave request not found");
    }

    const leave = doc.data();

    if (leave.employeeId !== employeeId) {
      throw new Error("Access denied");
    }

    if (
      [
        "cancelled",
        "rejected",
        "revoked",
      ].includes(leave.status)
    ) {
      throw new Error(
        "This leave request cannot be cancelled."
      );
    }

    if (
      leave.status === "approved" &&
      leave.startDate <
        new Date().toISOString().slice(0, 10)
    ) {
      throw new Error(
        "Past or active approved leave cannot be cancelled."
      );
    }

    previousStatus = leave.status;
    leaveData = leave;

    const now = new Date();

    transaction.update(ref, {
      status: "cancelled",
      cancelledAt: now,
      updatedAt: now,
    });
  });

  return {
    previousStatus,
    leave: leaveData,
  };
};

/* =========================================================
   CALCULATE ELAPSED WORKING DAYS

   Excludes:
   - Saturday
   - Sunday
   - Official holidays from Firestore
========================================================= */

const calculateElapsedWorkingDays = (
  createdAt,
  holidayDates
) => {
  if (!createdAt) {
    return 0;
  }

  const submittedDate =
    typeof createdAt.toDate === "function"
      ? createdAt.toDate()
      : new Date(createdAt);

  if (Number.isNaN(submittedDate.getTime())) {
    return 0;
  }

  const currentDate = new Date();

  submittedDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  let workingDays = 0;

  // Begin counting from the day after submission
  const date = new Date(submittedDate);

  date.setDate(date.getDate() + 1);

  while (date < currentDate) {
    const dayOfWeek = date.getDay();

    const dateString = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    const isWeekend =
      dayOfWeek === 0 || dayOfWeek === 6;

    const isOfficialHoliday =
      holidayDates.has(dateString);

    if (!isWeekend && !isOfficialHoliday) {
      workingDays++;
    }

    date.setDate(date.getDate() + 1);
  }

  return workingDays;
};

/* =========================================================
   AUTOMATICALLY REVOKE EXPIRED PENDING LEAVES

   Rule:
   Revoke after 3 completed working days.
========================================================= */

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

    const elapsedWorkingDays =
      calculateElapsedWorkingDays(
        leave.createdAt,
        holidayDates
      );

    if (elapsedWorkingDays >= 3) {
      const now = new Date();

      await doc.ref.update({
        status: "revoked",

        revokedAt: now,

        revokedReason:
          "Automatically revoked after remaining pending for 3 working days.",

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

/* =========================================================
   CLEAR ALL LEAVE REQUESTS
========================================================= */

const clearAllLeaveRequests = async () => {
  const snapshot = await db
    .collection("leaveRequests")
    .get();

  if (snapshot.empty) {
    return {
      deletedCount: 0,
    };
  }

  const docs = snapshot.docs;

  let deletedCount = 0;

  // Firestore batch limit: maximum 500 operations
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

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  createLeaveRequest,
  getMyLeaveRequests,
  getAllLeaveRequests,

  // Required by officer dashboards
  filterPendingForStage,
  getPendingForStage,

  getLeaveById,
  hasOverlappingLeave,
  recordDecision,
  cancelLeaveRequest,

  // Admin feature
  clearAllLeaveRequests,

  // Automatic revocation
  calculateElapsedWorkingDays,
  revokeExpiredLeaveRequests,
};