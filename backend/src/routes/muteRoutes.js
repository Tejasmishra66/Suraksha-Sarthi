const express = require("express");
const muteModel = require("../models/muteModel");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", auth, (req, res) => {
  const office = req.user?.district;
  if (!office) return res.json([]);
  return res.json(muteModel.listMutedAlerts(office));
});

router.post("/", auth, (req, res) => {
  const office = req.user?.district;
  const { alertId, alertType } = req.body;
  if (!office || !alertId || !alertType) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  
  const result = muteModel.muteAlert({
    alertId,
    alertType,
    office,
    mutedBy: req.user.id
  });
  
  return res.status(201).json({ id: result.lastInsertRowid, alertId, alertType, office });
});

module.exports = router;
