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
} = require("../controllers/leaveController");

const router = express.Router();
const allRoles = authorizeRoles(
  "admin",
  "employee",
  "reportingOfficer",
  "reviewingOfficer",
  "approvingAuthority"
);

router.use(verifyToken);
router.post("/apply", authorizeRoles("employee"), validateLeaveApplication, applyLeave);
router.get("/my-leaves", authorizeRoles("employee"), getMyLeaves);
router.get("/balance", authorizeRoles("employee"), getMyLeaveBalance);
router.get("/balance/history", authorizeRoles("employee"), getMyBalanceHistory);
router.patch("/:id/cancel", authorizeRoles("employee"), cancelMyLeave);

router.get("/all", authorizeRoles("admin"), getAllLeaves);
router.get("/reporting/pending", authorizeRoles("reportingOfficer"), getPendingReporting);
router.put(
  "/reporting/:id/review",
  authorizeRoles("reportingOfficer"),
  validateDecision,
  reviewLeaveByReportingOfficer
);
router.get("/reviewing/pending", authorizeRoles("reviewingOfficer"), getPendingReviewing);
router.put(
  "/reviewing/:id/review",
  authorizeRoles("reviewingOfficer"),
  validateDecision,
  reviewLeaveByReviewingOfficer
);
router.get("/approving/pending", authorizeRoles("approvingAuthority"), getPendingApproving);
router.put(
  "/approving/:id/review",
  authorizeRoles("approvingAuthority"),
  validateDecision,
  reviewLeaveByApprovingAuthority
);
router.get("/:id", allRoles, getLeaveDetails);

module.exports = router;
