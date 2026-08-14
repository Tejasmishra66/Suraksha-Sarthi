const express = require("express");
const { db } = require("../db/database");
const { queueOperation, flushQueuedOperations } = require("../services/syncService");
const incidentModel = require("../models/incidentModel");

const router = express.Router();

// Receives batch offline queue events from field app
router.post("/queue", (req, res) => {
  const { items = [] } = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json({ message: "items must be an array" });
  }

  items.forEach((item) => {
    queueOperation(item.entityType, item.entityId || null, item.operation, item.payload || {});
  });

  return res.status(201).json({ accepted: items.length });
});

// Directly batch sync offline emergency incidents (2G low-bandwidth mode)
router.post("/batch", (req, res) => {
  const { incidents = [], items = [] } = req.body;
  const listToProcess = Array.isArray(incidents) && incidents.length > 0 ? incidents : items;

  if (!Array.isArray(listToProcess)) {
    return res.status(400).json({ message: "incidents must be an array" });
  }

  let createdCount = 0;
  listToProcess.forEach((item) => {
    const payload = item.payload || item;
    try {
      incidentModel.createIncident({
        title: payload.title || "Offline Emergency SITREP",
        description: payload.description || "",
        disasterType: payload.disasterType || payload.disaster_type || "General Emergency",
        reporterPhone: payload.reporterPhone || payload.phone || null,
        lat: payload.lat,
        lng: payload.lng || payload.lon,
        address: payload.address || null,
        status: payload.status || "active",
      });
      createdCount++;
    } catch (err) {
      console.error("Batch sync item error:", err.message);
    }
  });

  return res.status(201).json({
    syncedCount: createdCount,
    totalReceived: listToProcess.length,
    message: `Successfully synchronized ${createdCount} offline emergency reports to SDRF Control Room.`,
  });
});

// Applies queued operations to main tables
router.post("/flush", (_req, res) => {
  const processed = flushQueuedOperations();
  return res.json({ processed });
});

// Returns queued operations
router.get("/queue", (_req, res) => {
  const rows = db.prepare("SELECT * FROM offline_queue ORDER BY id DESC").all();
  return res.json(rows);
});

module.exports = router;
