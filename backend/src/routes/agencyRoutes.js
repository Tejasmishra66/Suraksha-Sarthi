const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const agencyController = require("../controllers/agencyController");

const router = express.Router();

router.get("/", asyncHandler(agencyController.listAgencies));

module.exports = router;