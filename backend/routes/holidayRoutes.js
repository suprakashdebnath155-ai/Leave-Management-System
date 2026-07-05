const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const {
  addHoliday,
  getHolidays,
  removeHoliday,
} = require("../controllers/holidayController");

const router = express.Router();
router.use(verifyToken);
router.get("/", getHolidays);
router.post("/", authorizeRoles("admin"), addHoliday);
router.delete("/:id", authorizeRoles("admin"), removeHoliday);

module.exports = router;
