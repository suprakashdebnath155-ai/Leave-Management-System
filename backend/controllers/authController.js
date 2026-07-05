const crypto = require("crypto");
const { db } = require("../config/firebase");
const { createLeaveBalance } = require("../services/leaveBalanceService");
const {
  createFirebaseUser,
  createUserProfile,
} = require("../services/authService");
const { initializeDashboardStats } = require("../services/dashboardStatsService");
const { sendEmail } = require("../services/emailService");
const { welcomeEmailTemplate } = require("../templates/welcomeEmail");
const { writeAuditLog } = require("../services/auditService");

const createEmployeeAccount = async (req, res) => {
  try {
    const {
      name,
      email,
      role,
      department,
      jobMode,
      dateOfJoining,
      designation,
      reportingOfficerId,
      reviewingOfficerId,
      approvingAuthorityId,
      employeeId,
    } = req.body;
    const temporaryPassword = `Tmp@${crypto.randomBytes(5).toString("hex")}A1`;
    const userRecord = await createFirebaseUser(email, temporaryPassword);
    const profile = await createUserProfile({
      uid: userRecord.uid,
      name,
      email,
      role,
      department,
      jobMode,
      dateOfJoining,
      designation: designation || "",
      reportingOfficerId: reportingOfficerId || "",
      reviewingOfficerId: reviewingOfficerId || "",
      approvingAuthorityId: approvingAuthorityId || "",
      employeeId: employeeId || userRecord.uid.slice(0, 8).toUpperCase(),
      isActive: true,
      forcePasswordChange: true,
    });
    await createLeaveBalance(userRecord.uid, jobMode);
    await initializeDashboardStats(userRecord.uid);
    // Send success response immediately
res.status(201).json({
  success: true,
  message: "Employee account created successfully",
  uid: userRecord.uid,
  temporaryPassword,
  profile,
});

// Send email in the background
sendEmail({
  to: email,
  subject: "Welcome to Leave Management System",
  html: welcomeEmailTemplate({ name, email, temporaryPassword }),
}).catch((err) => console.error("Email Error:", err));

// Write audit log in the background
writeAuditLog({
  actorId: req.user.uid,
  action: "USER_CREATED",
  entityType: "user",
  entityId: userRecord.uid,
  details: { role, department },
}).catch((err) => console.error("Audit Log Error:", err));
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const loginUser = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authenticate with Firebase on the client and send the ID token.",
  });
};

const getMyProfile = async (req, res) => {
  try {
    const userDoc = await db.collection("users").doc(req.user.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }
    const profile = userDoc.data();
    if (profile.isActive === false) {
      return res.status(403).json({ success: false, message: "Account inactive" });
    }
    res.json({ success: true, profile: { id: userDoc.id, ...profile } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const allowed = ["name", "phone", "photoURL"];
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(
        ([key, value]) => allowed.includes(key) && typeof value === "string"
      )
    );
    if (!Object.keys(updates).length) {
      return res.status(400).json({ success: false, message: "No valid updates" });
    }
    await db.collection("users").doc(req.user.uid).update({
      ...updates,
      updatedAt: new Date(),
    });
    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const adminOnly = (req, res) => {
  res.json({ success: true, message: "Welcome Admin", profile: req.profile });
};

module.exports = {
  createEmployeeAccount,
  loginUser,
  getMyProfile,
  updateMyProfile,
  adminOnly,
};
