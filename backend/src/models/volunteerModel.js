const { db } = require("../db/database");

function listVolunteers() {
  return db.prepare("SELECT * FROM volunteers ORDER BY id DESC").all();
}

function listActiveVolunteers() {
  return db.prepare("SELECT * FROM volunteers WHERE active = 1 ORDER BY id DESC").all();
}

function getVolunteerByUserId(userId) {
  return db.prepare("SELECT * FROM volunteers WHERE user_id = ?").get(userId);
}

function createVolunteer(data) {
  const stmt = db.prepare(
    `INSERT INTO volunteers
       (name, phone, lat, lng, capabilities, terrain_restrictions, department, place,
        skills, aadhaar, aadhaar_front_url, aadhaar_back_url, district, user_id, status, active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  return stmt.run(
    data.name,
    data.phone,
    data.lat   || 0,
    data.lng   || 0,
    data.capabilities || data.skills || "",
    data.terrain_restrictions || null,
    data.department || null,
    data.place  || data.district || null,
    data.skills || null,
    data.aadhaar || null,
    data.aadhaar_front_url || data.aadhaarFrontUrl || null,
    data.aadhaar_back_url || data.aadhaarBackUrl || null,
    data.district || data.place || null,
    data.user_id || null,
    data.status || "pending",
    1
  );
}

function updateVolunteer(id, data) {
  const stmt = db.prepare(
    `UPDATE volunteers SET
       name = COALESCE(?, name),
       phone = COALESCE(?, phone),
       skills = COALESCE(?, skills),
       capabilities = COALESCE(?, capabilities),
       aadhaar = COALESCE(?, aadhaar),
       aadhaar_front_url = COALESCE(?, aadhaar_front_url),
       aadhaar_back_url = COALESCE(?, aadhaar_back_url),
       district = COALESCE(?, district),
       place = COALESCE(?, place),
       status = COALESCE(?, status)
     WHERE id = ?`
  );
  return stmt.run(
    data.name || null,
    data.phone || null,
    data.skills || null,
    data.skills || null,
    data.aadhaar || null,
    data.aadhaar_front_url || data.aadhaarFrontUrl || null,
    data.aadhaar_back_url || data.aadhaarBackUrl || null,
    data.district || data.place || null,
    data.place || data.district || null,
    data.status || null,
    id
  );
}

function updateVolunteerStatus(id, status) {
  return db.prepare("UPDATE volunteers SET status = ? WHERE id = ?").run(status, id);
}

module.exports = {
  listVolunteers,
  listActiveVolunteers,
  getVolunteerByUserId,
  createVolunteer,
  updateVolunteer,
  updateVolunteerStatus,
};
