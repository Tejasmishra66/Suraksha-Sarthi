const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const incidentController = require("../controllers/incidentController");
const { uploadSinglePhoto } = require("../services/mediaUploadService");

const router = express.Router();

router.get("/", asyncHandler(incidentController.listIncidents));
router.post("/", asyncHandler(incidentController.createIncident));
router.post("/:id/media", uploadSinglePhoto, asyncHandler(incidentController.uploadMedia));

module.exports = router;
