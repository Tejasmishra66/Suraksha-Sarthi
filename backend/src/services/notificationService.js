const { db } = require("../db/database");
const { haversineKm } = require("../utils/geo");
const { sendSms } = require("./smsService");

const DISASTER_TO_SKILLS = {
  Flood: ["SAR", "Medical", "Debris"],
  Earthquake: ["SAR", "FMR", "Medical"],
  Landslide: ["SAR", "Debris"],
  Cyclone: ["SAR", "Utility", "Connectivity"]
};

function normalizeSkills(rawValue) {
  return String(rawValue || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function findMatchingVolunteers(lat, lng, radiusKm, requiredSkills) {
  // Filters volunteers by geofence radius and capability tags.
  const volunteers = db.prepare("SELECT * FROM volunteers WHERE active = 1").all();
  const required = requiredSkills.map((item) => item.toLowerCase());

  return volunteers.filter((volunteer) => {
    const distance = haversineKm(lat, lng, volunteer.lat, volunteer.lng);
    if (distance > radiusKm) return false;

    const capabilities = normalizeSkills(volunteer.capabilities);
    return required.length === 0 || required.some((skill) => capabilities.includes(skill));
  });
}

function createAlertAndNotify({ disasterType, lat, lng, radiusKm, severity, createdBy }) {
  // Creates alert row and notifies matched volunteers and agency heads.
  const alertInsert = db.prepare(
    `INSERT INTO alerts (disaster_type, lat, lng, radius_km, severity, created_by)
     VALUES (?, ?, ?, ?, ?, ?)`
  );
  const result = alertInsert.run(disasterType, lat, lng, radiusKm, severity, createdBy);
  const alertId = result.lastInsertRowid;

  const requiredSkills = DISASTER_TO_SKILLS[disasterType] || [];
  const volunteers = findMatchingVolunteers(lat, lng, radiusKm, requiredSkills);

  const recipientInsert = db.prepare(
    "INSERT INTO alert_recipients (alert_id, volunteer_id, user_id, channel, responded) VALUES (?, ?, ?, ?, 0)"
  );

  volunteers.forEach((volunteer) => {
    recipientInsert.run(alertId, volunteer.id, null, "sms");
    sendSms(volunteer.phone, `SDRF Alert: ${disasterType} near your area. Reply in app.`);
  });

  const agencyHeads = db.prepare("SELECT * FROM users WHERE role = 'agency_head'").all();
  agencyHeads.forEach((user) => {
    recipientInsert.run(alertId, null, user.id, "app");
  });

  return {
    alertId,
    disasterType,
    recipientsCount: volunteers.length + agencyHeads.length,
    matchedVolunteerIds: volunteers.map((item) => item.id)
  };
}

function startEscalationMonitor() {
  // Escalates alerts if no recipients respond within 5 minutes.
  const escalateStatement = db.prepare(
    `SELECT a.*
     FROM alerts a
     WHERE a.escalated = 0
       AND datetime(a.created_at) <= datetime('now', '-5 minutes')`
  );

  const checkResponseStatement = db.prepare(
    "SELECT COUNT(*) AS count FROM alert_recipients WHERE alert_id = ? AND responded = 1"
  );

  const escalateUpdate = db.prepare(
    "UPDATE alerts SET escalated = 1, escalation_at = CURRENT_TIMESTAMP WHERE id = ?"
  );

  const heads = db.prepare("SELECT * FROM users WHERE role = 'agency_head'").all();

  setInterval(() => {
    const staleAlerts = escalateStatement.all();
    staleAlerts.forEach((alert) => {
      const responseCount = checkResponseStatement.get(alert.id).count;
      if (responseCount > 0) return;

      escalateUpdate.run(alert.id);
      heads.forEach((head) => {
        // Use the actual phone from the agency head's user record, not a placeholder.
        if (head.phone) {
          sendSms(
            head.phone,
            `SDRF Escalation: Alert #${alert.id} (${alert.disaster_type}) has had no response for 5 minutes. Immediate action required.`
          );
        }
        db.prepare(
          "INSERT INTO alert_recipients (alert_id, volunteer_id, user_id, channel, responded) VALUES (?, ?, ?, ?, 0)"
        ).run(alert.id, null, head.id, "escalation_sms");
      });
    });
  }, 60 * 1000);
}

module.exports = {
  findMatchingVolunteers,
  createAlertAndNotify,
  startEscalationMonitor
};
