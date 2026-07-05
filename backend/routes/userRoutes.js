const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const {
  getUsers,
  updateUser,
  deleteUser,
  setUserStatus,
  resetUserPassword,
} = require("../controllers/userController");

const router = express.Router();

router.use(verifyToken, authorizeRoles("admin"));
router.get("/", getUsers);
router.patch("/:id", updateUser);
router.patch("/:id/status", setUserStatus);
router.post("/:id/reset-password", resetUserPassword);
router.delete("/:id", deleteUser);

module.exports = router;
