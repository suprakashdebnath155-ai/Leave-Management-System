const { createNotification } = require("../services/notificationService");
const { sendEmail } = require("../services/emailService");
const { getUserProfile } = require("../services/authService");

const {
  deductLeaveBalance,
  restoreLeaveBalance,
  checkLeaveBalance,
  getAvailableLeaveBalance,
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
  clearAllLeaveRequests,
  revokeExpiredLeaveRequests,
} = require("../services/leaveService");

const {
  updateDashboardStats,
} = require("../services/dashboardStatsService");

const { writeAuditLog } = require("../services/auditService");
const { runBackgroundTask } = require("../utils/backgroundTask");

const {
  leaveAppliedEmailTemplate,
} = require("../templates/leaveAppliedEmail");

const {
  reportingAssignmentEmailTemplate,
} = require("../templates/reportingAssignmentEmail");

const {
  reviewingAssignmentEmailTemplate,
} = require("../templates/reviewingAssignmentEmail");

const {
  approvalEmailTemplate,
} = require("../templates/approvalEmail");

const {
  cancellationEmailTemplate,
} = require("../templates/cancellationEmail");


/* =========================================================
   NOTIFICATION HELPER
========================================================= */

const notify = async (payload) => {
  try {
    await createNotification(payload);
  } catch (error) {
    console.error("Notification failed:", error.message);
  }
};


/* =========================================================
   APPLY FOR LEAVE
========================================================= */

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

    /*
      Prevent past-date applications unless the employee
      explicitly marks the request as an emergency.
    */
    if (startDate < today && !emergency) {
      return res.status(400).json({
        success: false,
        message:
          "Start date cannot be in the past unless marked emergency.",
      });
    }

    /*
      Prevent overlapping active leave applications.
    */
    if (
      await hasOverlappingLeave(
        req.user.uid,
        startDate,
        endDate
      )
    ) {
      return res.status(409).json({
        success: false,
        message:
          "This request overlaps an existing leave application.",
      });
    }

    /*
      Calculate working days.

      Weekends and configured holidays are excluded by
      calculateWorkingDays().
    */
    const daysRequested = await calculateWorkingDays(
      startDate,
      endDate,
      halfDay
    );

    if (daysRequested <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "The selected dates do not contain any valid working days.",
      });
    }

    /*
      IMPORTANT:

      checkLeaveBalance() now checks AVAILABLE balance:

      available balance
        =
      permanent balance
        -
      pending reserved leave days

      This prevents employees from using the same leave
      balance for multiple pending applications.
    */
    const hasEnoughBalance = await checkLeaveBalance(
      req.user.uid,
      leaveType,
      daysRequested
    );

    if (!hasEnoughBalance) {
      return res.status(400).json({
        success: false,
        message:
          "Insufficient available leave balance. Some of your balance may already be reserved by pending leave requests.",
      });
    }

    const employee = await getUserProfile(req.user.uid);

    /*
      Create the pending leave request.

      Creating this request automatically causes these days
      to be treated as reserved by getAvailableLeaveBalance().
    */
    const leaveId = await createLeaveRequest({
      employeeId: req.user.uid,
      employeeName: employee.name,
      employeeCode: employee.employeeId || "",
      department: employee.department || "",
      designation: employee.designation || "",

      reportingOfficerId:
        employee.reportingOfficerId || "",

      reviewingOfficerId:
        employee.reviewingOfficerId || "",

      approvingAuthorityId:
        employee.approvingAuthorityId || "",

      leaveType,
      startDate,
      endDate,
      reason,
      halfDay,
      emergency,
      attachmentUrl,
      daysRequested,
    });

    /*
      Send emails, notifications, dashboard updates,
      and audit logs in the background.
    */
    runBackgroundTask(
      "Leave application side effects",
      async () => {
        await Promise.all([
          sendEmail({
            to: employee.email,
            subject:
              "Leave Application Submitted Successfully",

            html: leaveAppliedEmailTemplate({
              name: employee.name,
              leaveType,
              startDate,
              endDate,
              daysRequested,
            }),
          }),

          updateDashboardStats(req.user.uid),

          notify({
            userId: req.user.uid,
            title: "Leave submitted",
            message:
              `Your ${leaveType} request has entered the approval workflow.`,
            type: "info",
          }),

          writeAuditLog({
            actorId: req.user.uid,
            action: "LEAVE_APPLIED",
            entityType: "leave",
            entityId: leaveId,
            details: {
              leaveType,
              daysRequested,
            },
          }),
        ]);

        /*
          Notify assigned Reporting Officer.
        */
        if (employee.reportingOfficerId) {
          await notify({
            userId: employee.reportingOfficerId,
            title: "New leave request",
            message:
              `${employee.name} submitted a ${leaveType} request.`,
            type: "action",
          });

          const reportingOfficer =
            await getUserProfile(
              employee.reportingOfficerId
            );

          await sendEmail({
            to: reportingOfficer.email,

            subject:
              "New Leave Request Awaiting Your Review",

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
      }
    );

    return res.status(201).json({
      success: true,
      message: "Leave applied successfully",
      leaveId,
      daysRequested,
    });
  } catch (error) {
    console.error("Apply leave error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================================
   GET EMPLOYEE'S OWN LEAVE REQUESTS
========================================================= */

const getMyLeaves = async (req, res) => {
  try {
    const leaves = await getMyLeaveRequests(
      req.user.uid
    );

    return res.json({
      success: true,
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================================
   GET ALL LEAVE REQUESTS - ADMIN
========================================================= */

const getAllLeaves = async (req, res) => {
  try {
    const leaves = await getAllLeaveRequests(
      req.query
    );

    return res.json({
      success: true,
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================================
   GET PENDING REQUESTS FOR OFFICER STAGE
========================================================= */

const getPending = (stage) => async (req, res) => {
  try {
    const leaves = await getPendingForStage(
      stage,
      req.user.uid
    );

    return res.json({
      success: true,
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================================
   REVIEW LEAVE REQUEST

   Reporting Officer:
     recommended / rejected

   Reviewing Officer:
     recommended / rejected

   Approving Authority:
     approved / rejected
========================================================= */

const reviewLeave = (stage) => async (req, res) => {
  try {
    const { id } = req.params;

    const {
      decision,
      remark = "",
    } = req.body;

    /*
      Allowed decisions depend on workflow stage.
    */
    const allowedDecisions =
      stage === "approving"
        ? ["approved", "rejected"]
        : ["recommended", "rejected"];

    if (!allowedDecisions.includes(decision)) {
      return res.status(400).json({
        success: false,
        message:
          `Invalid decision "${decision}" for ${stage} stage.`,
      });
    }

    /*
      Load current leave before processing.
    */
    const leave = await getLeaveById(id);

    /*
      Determine which officer field belongs to this stage.
    */
    const officerField =
      stage === "reporting"
        ? "reportingOfficerId"
        : stage === "reviewing"
          ? "reviewingOfficerId"
          : "approvingAuthorityId";

    /*
      Ensure the logged-in officer is assigned to this request.
    */
    if (
      leave[officerField] &&
      leave[officerField] !== req.user.uid
    ) {
      return res.status(403).json({
        success: false,
        message:
          "This leave request is not assigned to you.",
      });
    }

    /*
      IMPORTANT:

      First record the workflow decision.

      This ensures that a leave is not permanently deducted
      before its final approval has successfully been recorded.
    */
    await recordDecision({
      leaveId: id,
      stage,
      decision,
      remark,
      officerId: req.user.uid,
    });

    /*
      Only the Approving Authority can send "approved".

      Permanent balance deduction happens exactly once,
      after successful final approval.

      We intentionally DO NOT call checkLeaveBalance() here,
      because the current pending request is already counted
      as reserved balance.
    */
    if (
      stage === "approving" &&
      decision === "approved"
    ) {
      await deductLeaveBalance(
        leave.employeeId,
        leave.leaveType,
        leave.daysRequested,
        id
      );
    }

    /*
      Determine the next officer in the workflow.
    */
    const nextOfficer =
      stage === "reporting"
        ? leave.reviewingOfficerId
        : stage === "reviewing"
          ? leave.approvingAuthorityId
          : null;

    /*
      Run notifications, emails, dashboard updates,
      and audit logging in the background.
    */
    runBackgroundTask(
      "Leave review side effects",
      async () => {
        await Promise.all([
          updateDashboardStats(
            leave.employeeId
          ),

          notify({
            userId: leave.employeeId,

            title:
              decision === "rejected"
                ? "Leave rejected"
                : decision === "approved"
                  ? "Leave approved"
                  : "Leave updated",

            message:
              decision === "approved"
                ? `Your ${leave.leaveType} request was approved.`
                : decision === "rejected"
                  ? `Your ${leave.leaveType} request was rejected by the ${stage} officer.`
                  : `Your ${leave.leaveType} request was recommended by the ${stage} officer.`,

            type:
              decision === "rejected"
                ? "error"
                : "success",
          }),

          writeAuditLog({
            actorId: req.user.uid,
            action:
              `LEAVE_${decision.toUpperCase()}`,
            entityType: "leave",
            entityId: id,
            details: {
              stage,
              remark,
            },
          }),
        ]);

        /*
          Send final email when Approving Authority
          approves or rejects.
        */
        if (stage === "approving") {
          const employee = await getUserProfile(
            leave.employeeId
          );

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

        /*
          If Reporting Officer recommends:
            notify Reviewing Officer.

          If Reviewing Officer recommends:
            notify Approving Authority.
        */
        if (
          decision === "recommended" &&
          nextOfficer
        ) {
          await notify({
            userId: nextOfficer,
            title: "Leave awaiting your review",
            message:
              `${leave.employeeName || "An employee"} has a request ready for review.`,
            type: "action",
          });

          const nextOfficerProfile =
            await getUserProfile(nextOfficer);

          await sendEmail({
            to: nextOfficerProfile.email,

            subject:
              "Leave Request Awaiting Your Review",

            html: reviewingAssignmentEmailTemplate({
              officerName:
                nextOfficerProfile.name,

              employeeName:
                leave.employeeName,

              employeeId:
                leave.employeeCode,

              department:
                leave.department,

              designation:
                leave.designation,

              leaveType:
                leave.leaveType,

              startDate:
                leave.startDate,

              endDate:
                leave.endDate,

              daysRequested:
                leave.daysRequested,

              reason:
                leave.reason,
            }),
          });
        }
      }
    );

    return res.json({
      success: true,
      message:
        decision === "approved"
          ? "Leave approved and balance deducted successfully."
          : decision === "rejected"
            ? "Leave rejected successfully."
            : "Leave recommended successfully.",
    });
  } catch (error) {
    console.error(
      `Leave review error:`,
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================================
   CANCEL EMPLOYEE LEAVE REQUEST
========================================================= */

const cancelMyLeave = async (req, res) => {
  try {
    const result = await cancelLeaveRequest(
      req.params.id,
      req.user.uid
    );

    /*
      If the leave had already been approved,
      restore its permanently deducted balance.

      For a pending leave:
      no permanent restoration is needed because pending days
      were only reserved, not physically deducted.
    */
    if (result.previousStatus === "approved") {
      await restoreLeaveBalance(
        req.user.uid,
        result.leave.leaveType,
        result.leave.daysRequested,
        req.params.id
      );
    }

    runBackgroundTask(
      "Leave cancellation side effects",
      async () => {
        const employee = await getUserProfile(
          req.user.uid
        );

        await Promise.all([
          updateDashboardStats(req.user.uid),

          notify({
            userId: req.user.uid,
            title: "Leave cancelled",
            message:
              "Your leave request was cancelled successfully.",
            type: "info",
          }),

          sendEmail({
            to: employee.email,
            subject:
              "Leave Cancelled Successfully",

            html: cancellationEmailTemplate({
              name: employee.name,
              leaveType:
                result.leave.leaveType,
              startDate:
                result.leave.startDate,
              endDate:
                result.leave.endDate,
            }),
          }),
        ]);
      }
    );

    return res.json({
      success: true,
      message: "Leave cancelled successfully",
    });
  } catch (error) {
    console.error(
      "Cancel leave error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================================
   GET AVAILABLE LEAVE BALANCE

   Response:
     balance       = currently available to apply
     actualBalance = permanent stored balance
     reserved      = pending leave reservations
========================================================= */

const getMyLeaveBalance = async (req, res) => {
  try {
    const result =
      await getAvailableLeaveBalance(
        req.user.uid
      );

    return res.json({
      success: true,

      /*
        Existing frontend uses this field.

        Example:
        Actual balance = 10
        Pending reserved = 3
        balance = 7
      */
      balance: result.balance,

      actualBalance:
        result.actualBalance,

      reserved:
        result.reserved,
    });
  } catch (error) {
    console.error(
      "Get leave balance error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================================
   GET BALANCE HISTORY
========================================================= */

const getMyBalanceHistory = async (req, res) => {
  try {
    const history = await getBalanceHistory(
      req.user.uid
    );

    return res.json({
      success: true,
      history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================================
   GET SINGLE LEAVE DETAILS
========================================================= */

const getLeaveDetails = async (req, res) => {
  try {
    const leave = await getLeaveById(
      req.params.id
    );

    /*
      Employees can access only their own leave requests.
      Officers and admin access is handled by route middleware.
    */
    if (
      req.profile.role === "employee" &&
      leave.employeeId !== req.user.uid
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return res.json({
      success: true,
      leave,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================================
   CLEAR ALL LEAVE REQUESTS - ADMIN
========================================================= */

const clearAllLeaves = async (req, res) => {
  try {
    const result =
      await clearAllLeaveRequests();

    await writeAuditLog({
      actorId: req.user.uid,
      action:
        "ALL_LEAVE_REQUESTS_DELETED",
      entityType: "leave",
      entityId: "all-leave-requests",
      details: {
        deletedCount:
          result.deletedCount,
      },
    });

    return res.status(200).json({
      success: true,

      message:
        result.deletedCount === 0
          ? "No leave requests found to delete."
          : `${result.deletedCount} leave request(s) deleted successfully.`,

      deletedCount:
        result.deletedCount,
    });
  } catch (error) {
    console.error(
      "Clear all leave requests error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================================
   REVOKE EXPIRED PENDING LEAVE REQUESTS

   Rule:
   Automatically revoke requests pending for 3 working days.

   Saturdays, Sundays, and official holidays are excluded.
========================================================= */

const revokeExpiredLeaves = async (req, res) => {
  try {
    const result =
      await revokeExpiredLeaveRequests();

    if (result.revokedCount > 0) {
      runBackgroundTask(
        "Expired leave revocation side effects",
        async () => {
          for (
            const leave of result.revokedLeaves
          ) {
            try {
              /*
                No balance restoration is required here.

                Why?

                Pending requests were only reserved.
                They were never permanently deducted.

                As soon as status changes:
                  pending -> revoked

                getAvailableLeaveBalance() automatically
                stops counting those days as reserved.
              */

              await updateDashboardStats(
                leave.employeeId
              );

              await notify({
                userId: leave.employeeId,
                title:
                  "Leave request automatically revoked",
                message:
                  `Your ${leave.leaveType} request was automatically revoked after remaining pending for 3 working days.`,
                type: "warning",
              });

              const employee =
                await getUserProfile(
                  leave.employeeId
                );

              await sendEmail({
                to: employee.email,

                subject:
                  "Leave Request Automatically Revoked",

                html: `
                  <!DOCTYPE html>
                  <html>
                    <body style="font-family: Arial, sans-serif; color: #333;">
                      <h2>Leave Request Automatically Revoked</h2>

                      <p>Dear ${employee.name},</p>

                      <p>
                        Your <strong>${leave.leaveType}</strong>
                        leave request from
                        <strong>${leave.startDate}</strong>
                        to
                        <strong>${leave.endDate}</strong>
                        has been automatically revoked because
                        it remained pending for 3 working days.
                      </p>

                      <p>
                        Saturdays, Sundays, and official holidays
                        are not counted as working days.
                      </p>

                      <p>
                        Please contact the concerned authority
                        if you require further assistance.
                      </p>

                      <br>

                      <p>
                        Regards,<br>
                        <strong>Leave Management System</strong>
                      </p>
                    </body>
                  </html>
                `,
              });

              await writeAuditLog({
                actorId: "system",
                action: "LEAVE_AUTO_REVOKED",
                entityType: "leave",
                entityId: leave.id,

                details: {
                  employeeId:
                    leave.employeeId,

                  leaveType:
                    leave.leaveType,

                  elapsedWorkingDays:
                    leave.elapsedWorkingDays,

                  reason:
                    "Automatically revoked after remaining pending for 3 working days.",
                },
              });
            } catch (sideEffectError) {
              console.error(
                `Auto-revocation side effect failed for leave ${leave.id}:`,
                sideEffectError.message
              );
            }
          }
        }
      );
    }

    return res.status(200).json({
      success: true,

      message:
        result.revokedCount === 0
          ? "No expired pending leave requests found."
          : `${result.revokedCount} expired leave request(s) automatically revoked.`,

      revokedCount:
        result.revokedCount,

      revokedLeaves:
        result.revokedLeaves.map(
          (leave) => ({
            id: leave.id,
            employeeId:
              leave.employeeId,
            employeeName:
              leave.employeeName,
            leaveType:
              leave.leaveType,
            elapsedWorkingDays:
              leave.elapsedWorkingDays,
          })
        ),
    });
  } catch (error) {
    console.error(
      "Auto-revoke expired leaves error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  applyLeave,

  getMyLeaves,
  getAllLeaves,

  getPendingReporting:
    getPending("reporting"),

  getPendingReviewing:
    getPending("reviewing"),

  getPendingApproving:
    getPending("approving"),

  reviewLeaveByReportingOfficer:
    reviewLeave("reporting"),

  reviewLeaveByReviewingOfficer:
    reviewLeave("reviewing"),

  reviewLeaveByApprovingAuthority:
    reviewLeave("approving"),

  getMyLeaveBalance,
  getMyBalanceHistory,

  cancelMyLeave,
  getLeaveDetails,

  clearAllLeaves,
  revokeExpiredLeaves,
};