const express = require("express");
const { db } = require("../db/database");
const { queueOperation, flushQueuedOperations } = require("../services/syncService");

const router = express.Router();

router.post("/queue", (req, res) => {
  // Receives batch offline queue events from field app.
  const { items = [] } = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json({ message: "items must be an array" });
  }

  items.forEach((item) => {
    queueOperation(item.entityType, item.entityId || null, item.operation, item.payload || {});
  });

  return res.status(201).json({ accepted: items.length });
});

router.post("/flush", (_req, res) => {
  // Applies queued operations to main tables.
  const processed = flushQueuedOperations();
  return res.json({ processed });
});

router.get("/queue", (_req, res) => {
  const rows = db.prepare("SELECT * FROM offline_queue ORDER BY id DESC").all();
  return res.json(rows);
});

module.exports = router;
