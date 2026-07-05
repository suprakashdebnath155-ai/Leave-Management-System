const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const {
  employeeDashboard,
  adminDashboard,
  reportingDashboard,
  reviewingDashboard,
  approvingDashboard,
} = require("../controllers/dashboardController");

const router = express.Router();
router.use(verifyToken);
router.get("/employee", authorizeRoles("employee"), employeeDashboard);
router.get("/admin", authorizeRoles("admin"), adminDashboard);
router.get("/reporting", authorizeRoles("reportingOfficer"), reportingDashboard);
router.get("/reviewing", authorizeRoles("reviewingOfficer"), reviewingDashboard);
router.get("/approving", authorizeRoles("approvingAuthority"), approvingDashboard);

module.exports = router;
