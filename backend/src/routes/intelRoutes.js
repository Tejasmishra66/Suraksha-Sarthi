const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const intelController = require("../controllers/intelController");

const router = express.Router();

router.get("/", asyncHandler(intelController.listIntel));
router.post("/", asyncHandler(intelController.createIntel));

module.exports = router;