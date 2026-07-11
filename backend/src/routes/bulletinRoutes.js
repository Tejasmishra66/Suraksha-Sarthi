const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const bulletinController = require("../controllers/bulletinController");
const requireRole = require("../middlewares/requireRole");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.get("/", asyncHandler(bulletinController.listBulletins));
router.post("/", authMiddleware, requireRole(["officer", "admin"]), asyncHandler(bulletinController.createBulletin));

module.exports = router;
