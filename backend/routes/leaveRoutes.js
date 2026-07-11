const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const {
  validateLeaveApplication,
  validateDecision,
} = require("../validations/leaveValidation");

const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  getPendingReporting,
  reviewLeaveByReportingOfficer,
  getPendingReviewing,
  reviewLeaveByReviewingOfficer,
  getPendingApproving,
  reviewLeaveByApprovingAuthority,
  getMyLeaveBalance,
  getMyBalanceHistory,
  cancelMyLeave,
  getLeaveDetails,
  clearAllLeaves,
  revokeExpiredLeaves,
} = require("../controllers/leaveController");

const router = express.Router();

const allRoles = authorizeRoles(
  "admin",
  "employee",
  "reportingOfficer",
  "reviewingOfficer",
  "approvingAuthority"
);

// All routes below this line require authentication
router.use(verifyToken);

// Employee routes
router.post(
  "/apply",
  authorizeRoles("employee"),
  validateLeaveApplication,
  applyLeave
);

router.get(
  "/my-leaves",
  authorizeRoles("employee"),
  getMyLeaves
);

router.get(
  "/balance",
  authorizeRoles("employee"),
  getMyLeaveBalance
);

router.get(
  "/balance/history",
  authorizeRoles("employee"),
  getMyBalanceHistory
);

router.post(
  "/admin/revoke-expired",
  authorizeRoles("admin"),
  revokeExpiredLeaves
);

router.patch(
  "/:id/cancel",
  authorizeRoles("employee"),
  cancelMyLeave
);

// Admin routes
router.get(
  "/all",
  authorizeRoles("admin"),
  getAllLeaves
);

router.delete(
  "/admin/clear-all",
  authorizeRoles("admin"),
  clearAllLeaves
);

// Reporting Officer routes
router.get(
  "/reporting/pending",
  authorizeRoles("reportingOfficer"),
  getPendingReporting
);

router.put(
  "/reporting/:id/review",
  authorizeRoles("reportingOfficer"),
  validateDecision,
  reviewLeaveByReportingOfficer
);

// Reviewing Officer routes
router.get(
  "/reviewing/pending",
  authorizeRoles("reviewingOfficer"),
  getPendingReviewing
);

router.put(
  "/reviewing/:id/review",
  authorizeRoles("reviewingOfficer"),
  validateDecision,
  reviewLeaveByReviewingOfficer
);

// Approving Authority routes
router.get(
  "/approving/pending",
  authorizeRoles("approvingAuthority"),
  getPendingApproving
);

router.put(
  "/approving/:id/review",
  authorizeRoles("approvingAuthority"),
  validateDecision,
  reviewLeaveByApprovingAuthority
);

// Leave details route
router.get(
  "/:id",
  allRoles,
  getLeaveDetails
);

module.exports = router;