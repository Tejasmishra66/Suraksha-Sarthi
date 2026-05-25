const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const volunteerController = require("../controllers/volunteerController");

const router = express.Router();

router.get("/", asyncHandler(volunteerController.listVolunteers));
router.post("/broadcast", asyncHandler(volunteerController.broadcast));
router.post("/", asyncHandler(volunteerController.createVolunteer));

module.exports = router;
