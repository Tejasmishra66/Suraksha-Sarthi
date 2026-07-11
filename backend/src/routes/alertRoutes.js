const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const alertController = require("../controllers/alertController");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.get("/", asyncHandler(alertController.listPins));
router.post("/", authMiddleware, asyncHandler(alertController.createAlert));
router.get("/:id/recipients", authMiddleware, asyncHandler(alertController.listAlertRecipients));
router.post("/:id/respond", authMiddleware, asyncHandler(alertController.respondAlert));

module.exports = router;
