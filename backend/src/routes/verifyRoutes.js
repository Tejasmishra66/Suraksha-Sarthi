const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const verifyController = require("../controllers/verifyController");
const authMiddleware = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");

const router = express.Router();

// Only admin and department officers may verify or reject incident reports.
router.post("/:incidentId", authMiddleware, requireRole(["admin", "department"]), asyncHandler(verifyController.verify));
router.get("/incidents", asyncHandler(verifyController.list));

module.exports = router;
