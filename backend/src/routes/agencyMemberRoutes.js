const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const agencyMemberController = require("../controllers/agencyMemberController");
const authMiddleware = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");

const router = express.Router();

router.get("/:agency/members", asyncHandler(agencyMemberController.listMembers));
// Only admins may add or modify agency member records.
router.post("/:agency/members", authMiddleware, requireRole(["admin"]), asyncHandler(agencyMemberController.createMember));

module.exports = router;