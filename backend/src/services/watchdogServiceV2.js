const watchdogModel = require("../models/watchdogModel");
const { sendSms } = require("./smsService");

function recordHeartbeat(agency, source = "api") {
  // Records watchdog heartbeat for agency endpoint.
  if (!agency) {
    const error = new Error("agency is required");
    error.statusCode = 400;
    throw error;
  }
  watchdogModel.recordHeartbeat(agency, source);
  return { ok: true, agency, at: new Date().toISOString() };
}

function getAgencyHealth() {
  // Computes online/offline status by last 5-minute heartbeat window.
  const agencies = watchdogModel.listDistinctAgencies();
  return agencies.map(({ agency }) => {
    const latest = watchdogModel.getLatestHeartbeat(agency);
    const online = latest ? watchdogModel.isOnlineByTimestamp(latest.heartbeat_at) : false;
    return {
      agency,
      status: online ? "online" : "offline",
      lastHeartbeatAt: latest ? latest.heartbeat_at : null
    };
  });
}

function startWatchdogMonitor() {
  // Sends fallback failover SMS when agency goes offline.
  setInterval(() => {
    const health = getAgencyHealth();
    health
      .filter((item) => item.status === "offline")
      .forEach((item) => {
        sendSms(
          "+910000000000",
          `Watchdog failover: ${item.agency} offline. Trigger Twilio/Gupshup SMS or IVR workflow.`
        );
      });
  }, 5 * 60 * 1000);
}

module.exports = {
  recordHeartbeat,
  getAgencyHealth,
  startWatchdogMonitor
};
