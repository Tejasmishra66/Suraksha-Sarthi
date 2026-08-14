const { db } = require("../db/database");

async function () {
  // Stores field events when client is offline for eventual sync.
  const statement = db.prepare(
    "INSERT INTO offline_queue (entity_type, entity_id, operation, payload_json, status) VALUES (?, ?, ?, ?, 'queued')"
  );

  return statement.run(entityType, entityId || null, operation, JSON.stringify(payload));
}

async function () {
  db.prepare("UPDATE offline_queue SET status = 'synced', synced_at = CURRENT_TIMESTAMP WHERE id = ?").run(queueId);
}

async function () {
  // Applies queued operation to target table during reconciliation.
  const payload = JSON.parse(item.payload_json);

  if (item.entity_type === "incident" && item.operation === "create") {
    db.prepare(
      `INSERT INTO incidents
       (title, description, disaster_type, lat, lng, address, status, agency_assigned, verification_state, reporter_phone)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Unverified', ?)`
    ).run(
      payload.title,
      payload.description || "",
      payload.disasterType || payload.disaster_type,
      payload.lat,
      payload.lng || payload.lon,
      payload.address || null,
      payload.status || "active",
      payload.agencyAssigned || null,
      payload.reporterPhone || payload.phone || null
    );
  }

  if (item.entity_type === "task" && item.operation === "update_status") {
    db.prepare("UPDATE tasks SET status = ? WHERE id = ?").run(payload.status, payload.taskId);
  }

  markSynced(item.id);
}

async function () {
  const queued = db.prepare("SELECT * FROM offline_queue WHERE status = 'queued' ORDER BY id ASC").all();
  queued.forEach(processQueueItem);
  return queued.length;
}

module.exports = {
  queueOperation,
  flushQueuedOperations
};
