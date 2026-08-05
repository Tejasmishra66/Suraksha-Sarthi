const { db } = require("../db/database");

function listIncidents() {
  return db.prepare("SELECT * FROM incidents ORDER BY created_at DESC").all();
}

function getIncidentById(incidentId) {
  return db.prepare("SELECT * FROM incidents WHERE id = ?").get(incidentId);
}

function createIncident(data) {
  const statement = db.prepare(
    `INSERT INTO incidents
      (title, description, disaster_type, lat, lng, address, status, agency_assigned, verification_state, media_hash, media_timestamp, media_gps, media_ref, office_tags)
     VALUES (?, ?, ?, ?, ?, ?, 'New', ?, 'Unverified', ?, ?, ?, ?, ?)`
  );

  return statement.run(
    data.title,
    data.description,
    data.disasterType,
    data.lat,
    data.lng || data.lon,
    data.address,
    data.agencyAssigned,
    data.mediaHash,
    data.mediaTimestamp,
    data.mediaGps,
    data.mediaRef,
    JSON.stringify(data.officeTags || [])
  );
}

function updateIncidentMedia(incidentId, { mediaHash, mediaTimestamp, mediaGps, mediaRef }) {
  return db
    .prepare(
      "UPDATE incidents SET media_hash = ?, media_timestamp = ?, media_gps = ?, media_ref = ? WHERE id = ?"
    )
    .run(mediaHash, mediaTimestamp, mediaGps, mediaRef, incidentId);
}

function verifyIncident(incidentId, officerId) {
  return db
    .prepare(
      "UPDATE incidents SET verification_state = 'Verified', verified_by = ?, verified_at = CURRENT_TIMESTAMP WHERE id = ?"
    )
    .run(officerId, incidentId);
}

function listIncidentsByVerification(onlyVerified) {
  const query = onlyVerified
    ? "SELECT * FROM incidents WHERE verification_state = 'Verified' ORDER BY created_at DESC"
    : "SELECT * FROM incidents ORDER BY created_at DESC";
  return db.prepare(query).all();
}

module.exports = {
  listIncidents,
  getIncidentById,
  createIncident,
  updateIncidentMedia,
  verifyIncident,
  listIncidentsByVerification
};
