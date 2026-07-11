const express = require("express");
const auditModel = require("../models/auditModel");
const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");

const router = express.Router();

router.get("/", auth, requireRole("admin", "agency_head"), (req, res) => {
  // Admin can see all, or filtered if query provided. Agency head sees only their office.
  let filter = req.query.office;
  if (req.user.role === "agency_head") {
    filter = req.user.district; // Force to their own office
  }
  
  return res.json(auditModel.listAuditLogs(filter));
});

module.exports = router;
