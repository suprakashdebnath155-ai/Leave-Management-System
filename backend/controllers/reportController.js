const { db } = require("../config/firebase");
const { getAllLeaveRequests } = require("../services/leaveService");

const getReport = async (req, res) => {
  try {
    const leaves = await getAllLeaveRequests(req.query);
    const usersSnapshot = await db.collection("users").get();
    const users = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const totals = leaves.reduce(
      (result, leave) => {
        result.total += 1;
        result.days += Number(leave.daysRequested || 0);
        result[leave.status || "pending"] =
          (result[leave.status || "pending"] || 0) + 1;
        return result;
      },
      { total: 0, days: 0, pending: 0, approved: 0, rejected: 0, cancelled: 0 }
    );
    const byDepartment = [...new Set(users.map((user) => user.department).filter(Boolean))]
      .map((department) => ({
        department,
        employees: users.filter((user) => user.department === department).length,
        requests: leaves.filter((leave) => leave.department === department).length,
        approvedDays: leaves
          .filter(
            (leave) => leave.department === department && leave.status === "approved"
          )
          .reduce((sum, leave) => sum + Number(leave.daysRequested || 0), 0),
      }));
    res.json({ success: true, report: { totals, byDepartment, records: leaves } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getReport };
