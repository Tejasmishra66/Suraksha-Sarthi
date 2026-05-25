const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const alertController = require("../controllers/alertController");

const router = express.Router();

router.get("/", asyncHandler(alertController.listPins));
router.post("/", asyncHandler(alertController.createAlert));
router.get("/:id/recipients", asyncHandler(alertController.listAlertRecipients));
router.post("/:id/respond", asyncHandler(alertController.respondAlert));

module.exports = router;
