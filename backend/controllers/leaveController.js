const { createNotification } = require("../services/notificationService");
const { sendEmail } = require("../services/emailService");
const { getUserProfile } = require("../services/authService");
const {
  deductLeaveBalance,
  restoreLeaveBalance,
  checkLeaveBalance,
  getLeaveBalance,
  getBalanceHistory,
} = require("../services/leaveBalanceService");
const { calculateWorkingDays } = require("../utils/dateUtils");
const {
  createLeaveRequest,
  getMyLeaveRequests,
  getAllLeaveRequests,
  getPendingForStage,
  getLeaveById,
  hasOverlappingLeave,
  recordDecision,
  cancelLeaveRequest,
} = require("../services/leaveService");
const { updateDashboardStats } = require("../services/dashboardStatsService");
const { writeAuditLog } = require("../services/auditService");
const { leaveAppliedEmailTemplate } = require("../templates/leaveAppliedEmail");
const { reportingAssignmentEmailTemplate, } = require("../templates/reportingAssignmentEmail");
const { reviewingAssignmentEmailTemplate, } = require("../templates/reviewingAssignmentEmail");
const { approvingAssignmentEmailTemplate, } = require("../templates/approvingAssignmentEmail");
const { approvalEmailTemplate, } = require("../templates/approvalEmail");
const { cancellationEmailTemplate, } = require("../templates/cancellationEmail");

const notify = async (payload) => {
  try {
    await createNotification(payload);
  } catch (error) {
    console.error("Notification failed:", error.message);
  }
};

const applyLeave = async (req, res) => {
  try {
    const {
      leaveType,
      startDate,
      endDate,
      reason,
      halfDay = false,
      emergency = false,
      attachmentUrl = "",
    } = req.body;
    const today = new Date().toISOString().slice(0, 10);
    if (startDate < today && !emergency) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be in the past unless marked emergency.",
      });
    }
    if (await hasOverlappingLeave(req.user.uid, startDate, endDate)) {
      return res.status(409).json({
        success: false,
        message: "This request overlaps an existing leave application.",
      });
    }
    const daysRequested = await calculateWorkingDays(startDate, endDate, halfDay);
    if (!(await checkLeaveBalance(req.user.uid, leaveType, daysRequested))) {
      return res.status(400).json({
        success: false,
        message: "Insufficient leave balance",
      });
    }
    const employee = await getUserProfile(req.user.uid);
    const leaveId = await createLeaveRequest({
      employeeId: req.user.uid,
      employeeName: employee.name,
      employeeCode: employee.employeeId || "",
      department: employee.department || "",
      designation: employee.designation || "",
      reportingOfficerId: employee.reportingOfficerId || "",
      reviewingOfficerId: employee.reviewingOfficerId || "",
      approvingAuthorityId: employee.approvingAuthorityId || "",
      leaveType,
      startDate,
      endDate,
      reason,
      halfDay,
      emergency,
      attachmentUrl,
      daysRequested,
    });

await sendEmail({
  to: employee.email,
  subject: "Leave Application Submitted Successfully",
  html: leaveAppliedEmailTemplate({
    name: employee.name,
    leaveType,
    startDate,
    endDate,
    daysRequested,
  }),
});

    await updateDashboardStats(req.user.uid);
    await notify({
      userId: req.user.uid,
      title: "Leave submitted",
      message: `Your ${leaveType} request has entered the approval workflow.`,
      type: "info",
    });
    if (employee.reportingOfficerId) {
      await notify({
        userId: employee.reportingOfficerId,
        title: "New leave request",
        message: `${employee.name} submitted a ${leaveType} request.`,
        type: "action",
      });
    }

if (employee.reportingOfficerId) {
  const reportingOfficer = await getUserProfile(
    employee.reportingOfficerId
  );

  await sendEmail({
    to: reportingOfficer.email,
    subject: "New Leave Request Awaiting Your Review",
    html: reportingAssignmentEmailTemplate({
      officerName: reportingOfficer.name,
      employeeName: employee.name,
      employeeId: employee.employeeId,
      department: employee.department,
      designation: employee.designation,
      leaveType,
      startDate,
      endDate,
      daysRequested,
      reason,
    }),
  });
}

    await writeAuditLog({
      actorId: req.user.uid,
      action: "LEAVE_APPLIED",
      entityType: "leave",
      entityId: leaveId,
      details: { leaveType, daysRequested },
    });
    res.status(201).json({
      success: true,
      message: "Leave applied successfully",
      leaveId,
      daysRequested,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getMyLeaves = async (req, res) => {
  try {
    const leaves = await getMyLeaveRequests(req.user.uid);
    res.json({ success: true, count: leaves.length, leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllLeaves = async (req, res) => {
  try {
    const leaves = await getAllLeaveRequests(req.query);
    res.json({ success: true, count: leaves.length, leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPending = (stage) => async (req, res) => {
  try {
    const leaves = await getPendingForStage(stage, req.user.uid);
    res.json({ success: true, count: leaves.length, leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const reviewLeave = (stage) => async (req, res) => {
  try {
    const { id } = req.params;
    const { decision, remark = "" } = req.body;
    const allowed =
      stage === "approving" ? ["approved", "rejected"] : ["recommended", "rejected"];
    if (!allowed.includes(decision)) {
      return res.status(400).json({ success: false, message: "Invalid decision" });
    }
    const leave = await getLeaveById(id);
    const officerField =
      stage === "reporting"
        ? "reportingOfficerId"
        : stage === "reviewing"
          ? "reviewingOfficerId"
          : "approvingAuthorityId";
    if (leave[officerField] && leave[officerField] !== req.user.uid) {
      return res.status(403).json({ success: false, message: "Request not assigned to you" });
    }
    if (decision === "approved") {
      if (!(await checkLeaveBalance(leave.employeeId, leave.leaveType, leave.daysRequested))) {
        return res.status(409).json({
          success: false,
          message: "Employee no longer has sufficient leave balance.",
        });
      }
      await deductLeaveBalance(
        leave.employeeId,
        leave.leaveType,
        leave.daysRequested,
        id
      );
    }
    await recordDecision({
      leaveId: id,
      stage,
      decision,
      remark,
      officerId: req.user.uid,
    });
    await updateDashboardStats(leave.employeeId);
    await notify({
      userId: leave.employeeId,
      title: decision === "rejected" ? "Leave rejected" : "Leave updated",
      message:
        decision === "approved"
          ? `Your ${leave.leaveType} request was approved.`
          : `Your request was ${decision} by the ${stage} officer.`,
      type: decision === "rejected" ? "error" : "success",
    });

if (stage === "approving") {

  const employee = await getUserProfile(leave.employeeId);

  await sendEmail({
    to: employee.email,
    subject:
      decision === "approved"
        ? "Leave Approved"
        : "Leave Rejected",
    html: approvalEmailTemplate({
      name: employee.name,
      leaveType: leave.leaveType,
      decision,
      remark,
    }),
  });

}

    const nextOfficer =
      stage === "reporting"
        ? leave.reviewingOfficerId
        : stage === "reviewing"
          ? leave.approvingAuthorityId
          : null;
if (decision === "recommended" && nextOfficer) {

  await notify({
    userId: nextOfficer,
    title: "Leave awaiting your review",
    message: `${leave.employeeName || "An employee"} has a request ready for review.`,
    type: "action",
  });

  const reviewingOfficer = await getUserProfile(nextOfficer);


  await sendEmail({
    to: reviewingOfficer.email,
    subject: "Leave Request Awaiting Your Review",
    html: reviewingAssignmentEmailTemplate({
      officerName: reviewingOfficer.name,
      employeeName: leave.employeeName,
      employeeId: leave.employeeCode,
      department: leave.department,
      designation: leave.designation,
      leaveType: leave.leaveType,
      startDate: leave.startDate,
      endDate: leave.endDate,
      daysRequested: leave.daysRequested,
      reason: leave.reason,
    }),
  });

}
    await writeAuditLog({
      actorId: req.user.uid,
      action: `LEAVE_${decision.toUpperCase()}`,
      entityType: "leave",
      entityId: id,
      details: { stage, remark },
    });
    res.json({ success: true, message: "Decision recorded successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const cancelMyLeave = async (req, res) => {
  try {
    const result = await cancelLeaveRequest(req.params.id, req.user.uid);
    if (result.previousStatus === "approved") {
      await restoreLeaveBalance(
        req.user.uid,
        result.leave.leaveType,
        result.leave.daysRequested,
        req.params.id
      );
    }
    await updateDashboardStats(req.user.uid);
    await notify({
      userId: req.user.uid,
      title: "Leave cancelled",
      message: "Your leave request was cancelled successfully.",
      type: "info",
    });

const employee = await getUserProfile(req.user.uid);

await sendEmail({
  to: employee.email,
  subject: "Leave Cancelled Successfully",
  html: cancellationEmailTemplate({
    name: employee.name,
    leaveType: result.leave.leaveType,
    startDate: result.leave.startDate,
    endDate: result.leave.endDate,
  }),
});

    res.json({ success: true, message: "Leave cancelled successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getMyLeaveBalance = async (req, res) => {
  try {
    const balance = await getLeaveBalance(req.user.uid);
    res.json({ success: true, balance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyBalanceHistory = async (req, res) => {
  try {
    const history = await getBalanceHistory(req.user.uid);
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getLeaveDetails = async (req, res) => {
  try {
    const leave = await getLeaveById(req.params.id);
    const isOwner = leave.employeeId === req.user.uid;
    const isAssigned = [
      leave.reportingOfficerId,
      leave.reviewingOfficerId,
      leave.approvingAuthorityId,
    ].includes(req.user.uid);
    if (!isOwner && !isAssigned && req.profile?.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    res.json({ success: true, leave });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

module.exports = {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  getPendingReporting: getPending("reporting"),
  getPendingReviewing: getPending("reviewing"),
  getPendingApproving: getPending("approving"),
  reviewLeaveByReportingOfficer: reviewLeave("reporting"),
  reviewLeaveByReviewingOfficer: reviewLeave("reviewing"),
  reviewLeaveByApprovingAuthority: reviewLeave("approving"),
  getMyLeaveBalance,
  getMyBalanceHistory,
  cancelMyLeave,
  getLeaveDetails,
};
