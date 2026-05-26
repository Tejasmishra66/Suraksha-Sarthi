const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const bulletinController = require("../controllers/bulletinController");
const requireRole = require("../middlewares/requireRole");

const router = express.Router();

router.get("/", asyncHandler(bulletinController.listBulletins));
router.post("/", requireRole("officer"), asyncHandler(bulletinController.createBulletin));

module.exports = router;
