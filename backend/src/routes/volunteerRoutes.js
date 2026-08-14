const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const volunteerController = require("../controllers/volunteerController");
const auth = require("../middlewares/auth");

const router = express.Router();

// Public / citizen accessible
router.get("/", asyncHandler(volunteerController.listVolunteers));
router.post("/broadcast", asyncHandler(volunteerController.broadcast));
router.post("/", asyncHandler(volunteerController.createVolunteer));

// Citizen: view and update own volunteer profile
router.get("/me", auth, asyncHandler(volunteerController.getMyProfile));
router.put("/me", auth, asyncHandler(volunteerController.updateMyProfile));

// Admin / Officer: approve or reject volunteer application
router.patch("/:id/status", auth, asyncHandler(volunteerController.updateStatus));

module.exports = router;
