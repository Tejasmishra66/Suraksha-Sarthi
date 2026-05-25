const { db } = require("../db/database");
const { sendSms } = require("./smsService");

function recordHeartbeat(agency, source = "api") {
  // Writes latest heartbeat for an agency endpoint.
  db.prepare("INSERT INTO watchdog_status (agency, source, status) VALUES (?, ?, 'online')").run(agency, source);
}

function getAgencyHealth() {
  // Returns agency health based on heartbeat in last 5 minutes.
  const agencies = db.prepare("SELECT DISTINCT agency FROM watchdog_status").all();
  return agencies.map(({ agency }) => {
    const latest = db
      .prepare(
        "SELECT heartbeat_at FROM watchdog_status WHERE agency = ? ORDER BY datetime(heartbeat_at) DESC LIMIT 1"
      )
      .get(agency);

    const isOnline = latest
      ? db
          .prepare(
            "SELECT CASE WHEN datetime(?) >= datetime('now', '-5 minutes') THEN 1 ELSE 0 END AS online"
          )
          .get(latest.heartbeat_at).online === 1
      : false;

    return {
      agency,
      status: isOnline ? "online" : "offline",
      lastHeartbeatAt: latest ? latest.heartbeat_at : null
    };
  });
}

function startWatchdogMonitor() {
  // Sends failover SMS when agency heartbeat is stale.
  setInterval(() => {
    const health = getAgencyHealth();
    health
      .filter((item) => item.status === "offline")
      .forEach((item) => {
        sendSms(
          "+910000000000",
          `Watchdog failover: ${item.agency} appears offline. Trigger IVR/SMS fallback.`
        );
      });
  }, 5 * 60 * 1000);
}

module.exports = {
  recordHeartbeat,
  getAgencyHealth,
  startWatchdogMonitor
};
