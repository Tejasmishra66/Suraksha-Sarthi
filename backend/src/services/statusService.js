const heartbeatModel = require("../models/heartbeatModel");
const { db } = require("../db/database");
const { sendSms } = require("./smsService");

function recordHeartbeat({ userId, location }) {
  // Persists the latest heartbeat for the user's agency.
  if (!userId) {
    const error = new Error("user_id is required");
    error.statusCode = 400;
    throw error;
  }

  heartbeatModel.upsertHeartbeat({ userId, location });
  const user = db.prepare("SELECT id, agency FROM users WHERE id = ?").get(userId);

  return {
    ok: true,
    userId,
    agencyId: user?.agency || null,
    location: location || null,
    lastSeen: new Date().toISOString(),
    status: "ONLINE"
  };
}

function listStatuses() {
  // Returns the current agency monitoring feed.
  return heartbeatModel.listAgencyStatuses();
}

function getFallbackContact(agencyId) {
  const row = db
    .prepare("SELECT phone FROM users WHERE agency = ? AND role = 'agency_head' AND phone IS NOT NULL ORDER BY id ASC LIMIT 1")
    .get(agencyId);
  return row?.phone || "+910000000000";
}

function startHeartbeatMonitor() {
  // Marks stale agencies offline and sends fallback SMS reminders.
  setInterval(() => {
    const stale = heartbeatModel.listOfflineCandidates(10);
    stale.forEach((item) => {
      heartbeatModel.markOffline(item.id);
      sendSms(
        getFallbackContact(item.agency_id),
        "Emergency Alert. SDRF app connection lost. Check satellite radio immediately."
      );
    });
  }, 5 * 60 * 1000);
}

module.exports = {
  recordHeartbeat,
  listStatuses,
  startHeartbeatMonitor
};