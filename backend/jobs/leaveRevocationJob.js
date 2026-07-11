const cron = require("node-cron");

const {
  revokeExpiredLeaveRequests,
} = require("../services/leaveService");

const {
  createNotification,
} = require("../services/notificationService");

const {
  sendEmail,
} = require("../services/emailService");

const {
  getUserProfile,
} = require("../services/authService");

const {
  updateDashboardStats,
} = require("../services/dashboardService");

const {
  writeAuditLog,
} = require("../services/auditService");

const notify = async (payload) => {
  try {
    return await createNotification(payload);
  } catch (error) {
    console.error(
      "Notification failed during automatic revocation:",
      error.message
    );
    return null;
  }
};

const processExpiredLeaveRevocations = async () => {
  const result = await revokeExpiredLeaveRequests();

  for (const leave of result.revokedLeaves) {
    try {
      await updateDashboardStats(leave.employeeId);

      await notify({
        userId: leave.employeeId,
        title: "Leave request automatically revoked",
        message: `Your ${leave.leaveType} request was automatically revoked after remaining pending for more than 3 working days.`,
        type: "warning",
      });

      const employee = await getUserProfile(leave.employeeId);

      if (employee?.email) {
        await sendEmail({
          to: employee.email,
          subject: "Leave Request Automatically Revoked",
          html: `
            <!DOCTYPE html>
            <html>
              <body style="font-family: Arial, sans-serif; color: #333;">
                <h2>Leave Request Automatically Revoked</h2>

                <p>Dear ${employee.name || "Employee"},</p>

                <p>
                  Your <strong>${leave.leaveType}</strong> leave request
                  from <strong>${leave.startDate}</strong> to
                  <strong>${leave.endDate}</strong> has been automatically
                  revoked because it remained pending for more than
                  3 working days.
                </p>

                <p>
                  Saturdays, Sundays, and official holidays are not counted
                  as working days.
                </p>

                <p>
                  Please contact the concerned authority if you require
                  further assistance.
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
      }

      await writeAuditLog({
        actorId: "system",
        action: "LEAVE_AUTO_REVOKED",
        entityType: "leave",
        entityId: leave.id,
        details: {
          employeeId: leave.employeeId,
          leaveType: leave.leaveType,
          elapsedWorkingDays: leave.elapsedWorkingDays,
          reason:
            "Automatically revoked after remaining pending for more than 3 working days.",
        },
      });

      console.log(
        `✅ Leave ${leave.id} automatically revoked successfully.`
      );
    } catch (error) {
      console.error(
        `❌ Side effects failed for revoked leave ${leave.id}:`,
        error.message
      );
    }
  }

  return result;
};

const startLeaveRevocationJob = () => {
  cron.schedule(
    "5 0 * * *",
    async () => {
      console.log(
        "⏰ Running automatic 3-working-day leave revocation check..."
      );

      try {
        const result = await processExpiredLeaveRevocations();

        console.log(
          `✅ Automatic leave revocation check completed. ${result.revokedCount} request(s) revoked.`
        );
      } catch (error) {
        console.error(
          "❌ Automatic leave revocation check failed:",
          error.message
        );
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );

  console.log(
    "📅 Automatic leave revocation scheduler started."
  );
};

module.exports = {
  processExpiredLeaveRevocations,
  startLeaveRevocationJob,
};