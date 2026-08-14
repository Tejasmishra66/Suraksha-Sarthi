const heartbeatModel = require("../models/heartbeatModel");
const { db } = require("../db/database");
const { sendSms } = require("./smsService");

async function () {
  // Persists the latest heartbeat for the user's agency.
  if (!userId) {
    const error = new Error("user_id is required");
    error.statusCode = 400;
    throw error;
  }

  await { userId, location });
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

async function () {
  // Returns the current agency monitoring feed.
  return await );
}

async function () {
  // Returns the agency head's phone, or null if none is registered.
  const row = db
    .prepare("SELECT phone FROM users WHERE agency = ? AND role = 'agency_head' AND phone IS NOT NULL ORDER BY id ASC LIMIT 1")
    .get(agencyId);
  return row?.phone || null;
}

async function () {
  // Marks stale agencies offline and sends fallback SMS reminders.
  setInterval(() => {
    const stale = await 10);
    stale.forEach((item) => {
      await item.id);
      const phone = getFallbackContact(item.agency_id);
      // Only send SMS if a real phone number is registered. Never call a placeholder.
      if (phone) {
        sendSms(
          phone,
          "SDRF Emergency Alert: App connection lost. Check satellite radio immediately."
        );
      }
    });
  }, 5 * 60 * 1000);
}

module.exports = {
  recordHeartbeat,
  listStatuses,
  startHeartbeatMonitor
};