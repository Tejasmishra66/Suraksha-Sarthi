const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const pingController = require("../controllers/pingController");

const router = express.Router();

router.post("/", asyncHandler(pingController.ping));
router.get("/status", asyncHandler(pingController.status));

module.exports = router;
