const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const resourceController = require("../controllers/resourceController");

const router = express.Router();

router.get("/", asyncHandler(resourceController.listResources));
router.get("/training-kits", asyncHandler(resourceController.listTrainingKits));
router.get("/export/resources.csv", asyncHandler(resourceController.exportResourcesCsv));
router.get("/export/rainfall.csv", asyncHandler(resourceController.exportRainfallCsv));
router.post("/", asyncHandler(resourceController.createResource));
router.patch("/:id/status", asyncHandler(resourceController.updateResourceStatus));

module.exports = router;
