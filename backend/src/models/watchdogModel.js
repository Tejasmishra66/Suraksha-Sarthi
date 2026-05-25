const { db } = require("../db/database");

function recordHeartbeat(agency, source) {
  return db.prepare("INSERT INTO watchdog_status (agency, source, status) VALUES (?, ?, 'online')").run(agency, source);
}

function listDistinctAgencies() {
  return db.prepare("SELECT DISTINCT agency FROM watchdog_status").all();
}

function getLatestHeartbeat(agency) {
  return db
    .prepare("SELECT heartbeat_at FROM watchdog_status WHERE agency = ? ORDER BY datetime(heartbeat_at) DESC LIMIT 1")
    .get(agency);
}

function isOnlineByTimestamp(timestamp) {
  return (
    db
      .prepare("SELECT CASE WHEN datetime(?) >= datetime('now', '-5 minutes') THEN 1 ELSE 0 END AS online")
      .get(timestamp).online === 1
  );
}

module.exports = {
  recordHeartbeat,
  listDistinctAgencies,
  getLatestHeartbeat,
  isOnlineByTimestamp
};
