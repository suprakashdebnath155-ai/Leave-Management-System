const { getAuth } = require("firebase-admin/auth");
const { db } = require("../config/firebase");
const { writeAuditLog } = require("../services/auditService");
const { clearUserProfileCache } = require("../services/authService");

const ALLOWED_ROLES = [
  "admin",
  "employee",
  "reportingOfficer",
  "reviewingOfficer",
  "approvingAuthority",
];

const getUsers = async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    let users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const { search, department, role, status } = req.query;
    if (search) {
      const term = search.toLowerCase();
      users = users.filter((user) =>
        [user.name, user.email, user.employeeId]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(term))
      );
    }
    if (department) users = users.filter((u) => u.department === department);
    if (role) users = users.filter((u) => u.role === role);
    if (status) {
      users = users.filter(
        (u) => String(u.isActive !== false) === status
      );
    }
    users.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const allowed = [
      "name", "department", "designation", "role", "jobMode",
      "dateOfJoining", "reportingOfficerId", "reviewingOfficerId",
      "approvingAuthorityId", "phone", "employeeId",
    ];
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(
        ([key, value]) => allowed.includes(key) && value !== undefined
      )
    );
    if (updates.role && !ALLOWED_ROLES.includes(updates.role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }
    if (!Object.keys(updates).length) {
      return res.status(400).json({ success: false, message: "No valid updates" });
    }
    await db.collection("users").doc(req.params.id).update({
      ...updates,
      updatedAt: new Date(),
    });
    clearUserProfileCache(req.params.id);
    await writeAuditLog({
      actorId: req.user.uid,
      action: "USER_UPDATED",
      entityType: "user",
      entityId: req.params.id,
      details: { fields: Object.keys(updates) },
    });
    res.json({ success: true, message: "Employee updated successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const setUserStatus = async (req, res) => {
  try {
    const isActive = Boolean(req.body.isActive);
    if (req.params.id === req.user.uid && !isActive) {
      return res.status(400).json({
        success: false,
        message: "You cannot deactivate your own account.",
      });
    }
    await getAuth().updateUser(req.params.id, { disabled: !isActive });
    await db.collection("users").doc(req.params.id).update({
      isActive,
      updatedAt: new Date(),
    });
    clearUserProfileCache(req.params.id);
    await writeAuditLog({
      actorId: req.user.uid,
      action: isActive ? "USER_ACTIVATED" : "USER_DEACTIVATED",
      entityType: "user",
      entityId: req.params.id,
    });
    res.json({
      success: true,
      message: `Employee ${isActive ? "activated" : "deactivated"}.`,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const resetUserPassword = async (req, res) => {
  try {
    const user = await getAuth().getUser(req.params.id);
    const link = await getAuth().generatePasswordResetLink(user.email);
    await writeAuditLog({
      actorId: req.user.uid,
      action: "PASSWORD_RESET_REQUESTED",
      entityType: "user",
      entityId: req.params.id,
    });
    res.json({
      success: true,
      message: "Password reset link generated.",
      resetLink: process.env.NODE_ENV === "production" ? undefined : link,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user.uid) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }
    await getAuth().deleteUser(req.params.id);
    const batch = db.batch();
    batch.delete(db.collection("users").doc(req.params.id));
    batch.delete(db.collection("leaveBalances").doc(req.params.id));
    batch.delete(db.collection("dashboardStats").doc(req.params.id));
    await batch.commit();
    clearUserProfileCache(req.params.id);
    await writeAuditLog({
      actorId: req.user.uid,
      action: "USER_DELETED",
      entityType: "user",
      entityId: req.params.id,
    });
    res.json({ success: true, message: "Employee deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUsers,
  updateUser,
  setUserStatus,
  resetUserPassword,
  deleteUser,
};
