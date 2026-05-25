const { db } = require("../db/database");

function createAlert({ disasterType, lat, lng, radiusKm, severity, createdBy }) {
  return db
    .prepare(
      `INSERT INTO alerts (disaster_type, lat, lng, radius_km, severity, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(disasterType, lat, lng, radiusKm, severity, createdBy);
}

function listAlertRecipients(alertId) {
  return db
    .prepare(
      `SELECT ar.*, v.name AS volunteer_name, u.name AS user_name
       FROM alert_recipients ar
       LEFT JOIN volunteers v ON v.id = ar.volunteer_id
       LEFT JOIN users u ON u.id = ar.user_id
       WHERE ar.alert_id = ?`
    )
    .all(alertId);
}

function createAlertRecipient({ alertId, volunteerId = null, userId = null, channel }) {
  return db
    .prepare(
      "INSERT INTO alert_recipients (alert_id, volunteer_id, user_id, channel, responded) VALUES (?, ?, ?, ?, 0)"
    )
    .run(alertId, volunteerId, userId, channel);
}

function markRecipientResponded(alertId, volunteerId, userId) {
  const query = volunteerId
    ? "UPDATE alert_recipients SET responded = 1, responded_at = CURRENT_TIMESTAMP WHERE alert_id = ? AND volunteer_id = ?"
    : "UPDATE alert_recipients SET responded = 1, responded_at = CURRENT_TIMESTAMP WHERE alert_id = ? AND user_id = ?";

  return db.prepare(query).run(alertId, volunteerId || userId);
}

function listAlertsForMap() {
  return db
    .prepare(
      "SELECT id, disaster_type, lat, lng, radius_km, severity, escalated, created_at FROM alerts ORDER BY datetime(created_at) DESC"
    )
    .all();
}

function listStaleAlerts() {
  return db
    .prepare(
      `SELECT a.*
       FROM alerts a
       WHERE a.escalated = 0
       AND datetime(a.created_at) <= datetime('now', '-5 minutes')`
    )
    .all();
}

function countResponses(alertId) {
  return db.prepare("SELECT COUNT(*) AS count FROM alert_recipients WHERE alert_id = ? AND responded = 1").get(alertId).count;
}

function markAlertEscalated(alertId) {
  return db.prepare("UPDATE alerts SET escalated = 1, escalation_at = CURRENT_TIMESTAMP WHERE id = ?").run(alertId);
}

module.exports = {
  createAlert,
  listAlertRecipients,
  createAlertRecipient,
  markRecipientResponded,
  listAlertsForMap,
  listStaleAlerts,
  countResponses,
  markAlertEscalated
};
