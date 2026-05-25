const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const bulletinController = require("../controllers/bulletinController");

const router = express.Router();

router.get("/", asyncHandler(bulletinController.listBulletins));
router.post("/", asyncHandler(bulletinController.createBulletin));

module.exports = router;
