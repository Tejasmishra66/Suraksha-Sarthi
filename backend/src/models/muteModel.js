const { db } = require("../db/database");

function muteAlert({ alertId, alertType, office, mutedBy }) {
  return db
    .prepare(
      "INSERT INTO muted_alerts (alert_id, alert_type, office, muted_by) VALUES (?, ?, ?, ?)"
    )
    .run(String(alertId), alertType, office, mutedBy);
}

function listMutedAlerts(office) {
  if (!office) return [];
  return db
    .prepare("SELECT alert_id, alert_type FROM muted_alerts WHERE office = ?")
    .all(office);
}

module.exports = {
  muteAlert,
  listMutedAlerts
};
