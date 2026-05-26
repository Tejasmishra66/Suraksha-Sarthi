const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const statusController = require("../controllers/statusController");

const router = express.Router();

router.get("/", asyncHandler(statusController.status));

module.exports = router;