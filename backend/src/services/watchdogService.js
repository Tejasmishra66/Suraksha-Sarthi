const { db } = require("../db/database");
const { sendSms } = require("./smsService");

async function () {
  // Writes latest heartbeat for an agency endpoint.
  db.prepare("INSERT INTO watchdog_status (agency, source, status) VALUES (?, ?, 'online')").run(agency, source);
}

async function () {
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

async function () {
  // Sends failover SMS when agency heartbeat is stale.
  setInterval(() => {
    const health = getAgencyHealth();
    const offlineAgencies = health.filter((item) => item.status === "offline");
    if (offlineAgencies.length === 0) return;

    // Load admin and department users who have a registered phone number.
    const notifyUsers = db
      .prepare("SELECT phone, name FROM users WHERE role IN ('admin', 'department') AND phone IS NOT NULL AND phone != ''")
      .all();

    offlineAgencies.forEach((item) => {
      notifyUsers.forEach((u) => {
        sendSms(
          u.phone,
          `SDRF Watchdog: Agency '${item.agency}' appears offline. Trigger IVR/SMS fallback immediately.`
        );
      });
    });
  }, 5 * 60 * 1000);
}

module.exports = {
  recordHeartbeat,
  getAgencyHealth,
  startWatchdogMonitor
};
