const express = require("express");
const { db } = require("../db/database");
const router = express.Router();

// GET /equipment - Fetch equipment catalog and live map coordinates
router.get("/", (req, res) => {
  try {
    const equipment = db.prepare("SELECT * FROM equipment").all();
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch equipment" });
  }
});

// POST /equipment - Add new equipment
router.post("/", (req, res) => {
  const { name, category, status } = req.body;
  try {
    const insert = db.prepare(`
      INSERT INTO equipment (qr_code, name, category, status)
      VALUES (?, ?, ?, ?)
    `);
    const qrCode = `EQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const result = insert.run(qrCode, name, category || 'General', status || 'available');
    res.json({ id: result.lastInsertRowid, qr_code: qrCode, success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to add equipment" });
  }
});

// POST /equipment/:id/scan - Logs a QR code scan
router.post("/:id/scan", (req, res) => {
  const { id } = req.params;
  const { action, lat, lng, receiver_id, sender_id } = req.body;
  
  try {
    // 1. Log the transfer/scan history
    const insertTransfer = db.prepare(`
      INSERT INTO equipment_transfers (equipment_id, sender_id, receiver_id, status)
      VALUES (?, ?, ?, ?)
    `);
    insertTransfer.run(id, sender_id || null, receiver_id || null, action);

    // 2. Update the equipment's current status and live map location
    const updateEquipment = db.prepare(`
      UPDATE equipment
      SET status = ?, lat = ?, lng = ?, last_scanned_at = CURRENT_TIMESTAMP
      WHERE id = ? OR qr_code = ?
    `);
    const newStatus = action === 'confirm' ? 'available' : action;
    updateEquipment.run(newStatus, lat || null, lng || null, id, id);

    res.json({ success: true, message: "Equipment scan logged successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to process scan" });
  }
});

// PATCH /equipment/:id/status - Update status for mobile QR scanner
router.patch("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updateStatus = db.prepare(`
      UPDATE equipment
      SET status = ?
      WHERE id = ? OR qr_code = ?
    `);
    updateStatus.run(status, id, id);
    res.json({ success: true, message: "Equipment status updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

module.exports = router;