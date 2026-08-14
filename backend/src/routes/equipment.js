const express = require("express");
const { db } = require("../db/database");
const router = express.Router();

// GET /equipment - Fetch equipment catalog
router.get("/", (req, res) => {
  try {
    const equipment = db.prepare("SELECT * FROM equipment ORDER BY id DESC").all();
    res.json({ success: true, data: equipment });
  } catch (error) {
    console.error("Failed to fetch equipment:", error);
    res.status(500).json({ error: "Failed to fetch equipment" });
  }
});

// POST /equipment - Add new equipment
router.post("/", (req, res) => {
  const { name, category, department, quantity, place, status } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Equipment name is required" });
  }
  try {
    const qrCode = `EQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const insert = db.prepare(`
      INSERT INTO equipment (qr_code, name, category, department, quantity, place, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = insert.run(
      qrCode,
      name.trim(),
      category ? category.trim() : 'Rescue Gear',
      department ? department.trim() : 'SDRF Shimla HQ',
      quantity ? Number(quantity) : 1,
      place ? place.trim() : 'Shimla HQ',
      status || 'available'
    );
    const newEquipment = db.prepare("SELECT * FROM equipment WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json({
      success: true,
      id: result.lastInsertRowid,
      qr_code: qrCode,
      equipment: newEquipment,
    });
  } catch (error) {
    console.error("Failed to add equipment:", error);
    res.status(500).json({ error: "Failed to add equipment" });
  }
});

// POST /equipment/dispatch - Dispatch equipment between Headquarters
router.post("/dispatch", (req, res) => {
  const { equipment_id, sender_hq, receiver_hq } = req.body;
  if (!equipment_id || !receiver_hq) {
    return res.status(400).json({ error: "equipment_id and receiver_hq are required" });
  }
  try {
    const fromHq = sender_hq || 'Shimla HQ';
    const toHq = receiver_hq;
    const transitPlace = `In Transit (${fromHq} ➔ ${toHq})`;

    db.transaction(() => {
      // Update equipment
      const update = db.prepare(`
        UPDATE equipment
        SET status = 'in_transit', place = ?, last_scanned_at = CURRENT_TIMESTAMP
        WHERE id = ? OR qr_code = ?
      `);
      update.run(transitPlace, equipment_id, equipment_id);

      // Insert transfer log
      const logInsert = db.prepare(`
        INSERT INTO equipment_transfers (equipment_id, sender_hq, receiver_hq, status)
        VALUES (?, ?, ?, 'in_transit')
      `);
      logInsert.run(equipment_id, fromHq, toHq);
    })();

    const updatedEq = db.prepare("SELECT * FROM equipment WHERE id = ? OR qr_code = ?").get(equipment_id, equipment_id);
    res.json({ success: true, message: `Dispatched from ${fromHq} to ${toHq}`, equipment: updatedEq });
  } catch (error) {
    console.error("Failed to dispatch equipment:", error);
    res.status(500).json({ error: "Failed to dispatch equipment" });
  }
});

// POST /equipment/receive - Receive equipment at destination HQ
router.post("/receive", (req, res) => {
  const { equipment_id, receiver_hq } = req.body;
  if (!equipment_id) {
    return res.status(400).json({ error: "equipment_id is required" });
  }
  try {
    const targetHq = receiver_hq || 'Mandi HQ';

    db.transaction(() => {
      // Update equipment status to available at new HQ
      const update = db.prepare(`
        UPDATE equipment
        SET status = 'available', place = ?, department = ?, last_scanned_at = CURRENT_TIMESTAMP
        WHERE id = ? OR qr_code = ?
      `);
      update.run(targetHq, `SDRF ${targetHq}`, equipment_id, equipment_id);

      // Update latest transfer log
      const logUpdate = db.prepare(`
        UPDATE equipment_transfers
        SET status = 'confirmed'
        WHERE equipment_id = ? AND status = 'in_transit'
      `);
      logUpdate.run(equipment_id);
    })();

    const updatedEq = db.prepare("SELECT * FROM equipment WHERE id = ? OR qr_code = ?").get(equipment_id, equipment_id);
    res.json({ success: true, message: `Equipment received at ${targetHq}`, equipment: updatedEq });
  } catch (error) {
    console.error("Failed to receive equipment:", error);
    res.status(500).json({ error: "Failed to receive equipment" });
  }
});

// POST /equipment/maintenance - Send to or Return from Maintenance
router.post("/maintenance", (req, res) => {
  const { equipment_id, action, reason } = req.body;
  if (!equipment_id) {
    return res.status(400).json({ error: "equipment_id is required" });
  }
  try {
    if (action === 'send') {
      const maintenanceReason = reason || 'Routine Servicing & Technical Repair';
      const update = db.prepare(`
        UPDATE equipment
        SET status = 'in_maintenance', maintenance_reason = ?, last_scanned_at = CURRENT_TIMESTAMP
        WHERE id = ? OR qr_code = ?
      `);
      update.run(maintenanceReason, equipment_id, equipment_id);

      const updatedEq = db.prepare("SELECT * FROM equipment WHERE id = ? OR qr_code = ?").get(equipment_id, equipment_id);
      return res.json({ success: true, message: "Equipment sent for maintenance", equipment: updatedEq });
    } else {
      const update = db.prepare(`
        UPDATE equipment
        SET status = 'available', maintenance_reason = NULL, last_scanned_at = CURRENT_TIMESTAMP
        WHERE id = ? OR qr_code = ?
      `);
      update.run(equipment_id, equipment_id);

      const updatedEq = db.prepare("SELECT * FROM equipment WHERE id = ? OR qr_code = ?").get(equipment_id, equipment_id);
      return res.json({ success: true, message: "Equipment returned from maintenance and marked Available", equipment: updatedEq });
    }
  } catch (error) {
    console.error("Failed to process maintenance:", error);
    res.status(500).json({ error: "Failed to process maintenance action" });
  }
});

// PATCH /equipment/:id/status - Update equipment status
router.patch("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, place } = req.body;
  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }
  try {
    const update = db.prepare(`
      UPDATE equipment
      SET status = ?, place = COALESCE(?, place), last_scanned_at = CURRENT_TIMESTAMP
      WHERE id = ? OR qr_code = ?
    `);
    update.run(status, place || null, id, id);
    res.json({ success: true, message: `Equipment status updated to ${status}` });
  } catch (error) {
    console.error("Failed to update status:", error);
    res.status(500).json({ error: "Failed to update equipment status" });
  }
});

// POST /equipment/:id/scan - Logs a QR code scan
router.post("/:id/scan", (req, res) => {
  const { id } = req.params;
  const { action, lat, lng, receiver_id, sender_id } = req.body;
  
  try {
    db.transaction(() => {
      const insertTransfer = db.prepare(`
        INSERT INTO equipment_transfers (equipment_id, sender_id, receiver_id, status)
        VALUES (?, ?, ?, ?)
      `);
      insertTransfer.run(id, sender_id || null, receiver_id || null, action);

      const newStatus = action === 'confirm' ? 'available' : action;
      const updateEquipment = db.prepare(`
        UPDATE equipment
        SET status = ?, lat = ?, lng = ?, last_scanned_at = CURRENT_TIMESTAMP
        WHERE id = ? OR qr_code = ?
      `);
      updateEquipment.run(newStatus, lat || null, lng || null, id, id);
    })();

    res.json({ success: true, message: "Equipment scan logged successfully" });
  } catch (error) {
    console.error("Failed to process scan:", error);
    res.status(500).json({ error: "Failed to process scan" });
  }
});

module.exports = router;