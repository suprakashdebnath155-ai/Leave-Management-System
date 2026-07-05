const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { getReport } = require("../controllers/reportController");

const router = express.Router();
router.get("/", verifyToken, authorizeRoles("admin"), getReport);

module.exports = router;
