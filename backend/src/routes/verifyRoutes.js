const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const verifyController = require("../controllers/verifyController");

const router = express.Router();

router.post("/:incidentId", asyncHandler(verifyController.verify));
router.get("/incidents", asyncHandler(verifyController.list));

module.exports = router;
