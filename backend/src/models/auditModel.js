const { db } = require("../db/database");

function logAudit({ userId, office, action, entityType, entityId, details, ipAddress }) {
  return db
    .prepare(
      `INSERT INTO audit_logs (user_id, office, action, entity_type, entity_id, details, ip_address)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(userId, office, action, entityType, String(entityId), JSON.stringify(details || {}), ipAddress);
}

function listAuditLogs(officeFilter) {
  if (officeFilter) {
    return db
      .prepare("SELECT * FROM audit_logs WHERE office = ? ORDER BY timestamp DESC LIMIT 500")
      .all(officeFilter);
  }
  return db.prepare("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 500").all();
}

module.exports = {
  logAudit,
  listAuditLogs
};
