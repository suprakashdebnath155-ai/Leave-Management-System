const { db } = require("../config/firebase");
const { getEmployeeDashboard } = require("../services/dashboardService");
const { getAllLeaveRequests, getPendingForStage } = require("../services/leaveService");

const employeeDashboard = async (req, res) => {
  try {
    const dashboard = await getEmployeeDashboard(req.user.uid);
    res.json({ success: true, dashboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const adminDashboard = async (req, res) => {
  try {
    const [usersSnapshot, leaves] = await Promise.all([
      db.collection("users").get(),
      getAllLeaveRequests(),
    ]);
    const users = usersSnapshot.docs.map((doc) => doc.data());
    const departments = [...new Set(users.map((user) => user.department).filter(Boolean))];
    const statusCounts = leaves.reduce(
      (counts, leave) => {
        counts[leave.status || "pending"] =
          (counts[leave.status || "pending"] || 0) + 1;
        return counts;
      },
      { pending: 0, approved: 0, rejected: 0, cancelled: 0 }
    );
    const byDepartment = departments.map((department) => ({
      department,
      employees: users.filter((user) => user.department === department).length,
      leaves: leaves.filter((leave) => leave.department === department).length,
    }));
    res.json({
      success: true,
      dashboard: {
        summary: {
          totalEmployees: users.length,
          activeEmployees: users.filter((user) => user.isActive !== false).length,
          totalDepartments: departments.length,
          totalLeaves: leaves.length,
          ...statusCounts,
        },
        byDepartment,
        recentLeaves: leaves.slice(0, 8),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const officerDashboard = (stage) => async (req, res) => {
  try {
    const pending = await getPendingForStage(stage, req.user.uid);
    const all = await getAllLeaveRequests();
    const reviewed = all.filter((leave) =>
      (leave.approvalHistory || []).some(
        (item) => item.stage === stage && item.officerId === req.user.uid
      )
    );
    res.json({
      success: true,
      dashboard: {
        summary: {
          pending: pending.length,
          reviewed: reviewed.length,
          recommended: reviewed.filter((leave) =>
            leave.approvalHistory?.some(
              (item) =>
                item.stage === stage &&
                item.officerId === req.user.uid &&
                ["recommended", "approved"].includes(item.decision)
            )
          ).length,
          rejected: reviewed.filter((leave) =>
            leave.approvalHistory?.some(
              (item) =>
                item.stage === stage &&
                item.officerId === req.user.uid &&
                item.decision === "rejected"
            )
          ).length,
        },
        pending,
        recentReviews: reviewed.slice(0, 8),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  employeeDashboard,
  adminDashboard,
  reportingDashboard: officerDashboard("reporting"),
  reviewingDashboard: officerDashboard("reviewing"),
  approvingDashboard: officerDashboard("approving"),
};
