const { db } = require("../db/database");

function getUserAgency(userId) {
  return db.prepare("SELECT agency, phone FROM users WHERE id = ?").get(userId);
}

function upsertHeartbeat({ userId, location }) {
  const user = getUserAgency(userId);
  if (!user || !user.agency) {
    const error = new Error("User agency not found");
    error.statusCode = 400;
    throw error;
  }

  const existing = db.prepare("SELECT id FROM heartbeats WHERE agency_id = ? ORDER BY id DESC LIMIT 1").get(user.agency);
  if (existing) {
    return db
      .prepare(
        "UPDATE heartbeats SET user_id = ?, location = ?, last_seen = CURRENT_TIMESTAMP, status = 'ONLINE' WHERE id = ?"
      )
      .run(userId, location || null, existing.id);
  }

  return db
    .prepare("INSERT INTO heartbeats (agency_id, user_id, location, status) VALUES (?, ?, ?, 'ONLINE')")
    .run(user.agency, userId, location || null);
}

function listAgencyStatuses() {
  return db
    .prepare(
      `SELECT h.id, h.agency_id, h.user_id, h.location, h.last_seen, h.status, u.name AS user_name, u.phone AS user_phone
       FROM heartbeats h
       LEFT JOIN users u ON u.id = h.user_id
       ORDER BY datetime(h.last_seen) DESC, h.id DESC`
    )
    .all();
}

function listOfflineCandidates(minutes = 10) {
  return db
    .prepare(
      `SELECT h.id, h.agency_id, h.user_id, h.location, h.last_seen, h.status
       FROM heartbeats h
       WHERE h.status != 'OFFLINE'
         AND datetime(h.last_seen) <= datetime('now', ?)`
    )
    .all(`-${Number(minutes)} minutes`);
}

function markOffline(heartbeatId) {
  return db.prepare("UPDATE heartbeats SET status = 'OFFLINE' WHERE id = ?").run(heartbeatId);
}

module.exports = {
  upsertHeartbeat,
  listAgencyStatuses,
  listOfflineCandidates,
  markOffline
};