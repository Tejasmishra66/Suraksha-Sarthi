const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const agencyMemberController = require("../controllers/agencyMemberController");

const router = express.Router();

router.get("/:agency/members", asyncHandler(agencyMemberController.listMembers));
router.post("/:agency/members", asyncHandler(agencyMemberController.createMember));

module.exports = router;