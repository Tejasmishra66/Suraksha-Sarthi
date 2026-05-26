const { db } = require("../db/database");

function listVolunteers() {
  return db.prepare("SELECT * FROM volunteers ORDER BY id DESC").all();
}

function listActiveVolunteers() {
  return db.prepare("SELECT * FROM volunteers WHERE active = 1").all();
}

function createVolunteer(data) {
  const stmt = db.prepare(
    `INSERT INTO volunteers (name, phone, lat, lng, capabilities, terrain_restrictions, department, place, active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  return stmt.run(
    data.name,
    data.phone,
    data.lat,
    data.lng,
    data.capabilities,
    data.terrain_restrictions || null,
    data.department || null,
    data.place || null,
    data.active ? 1 : 1
  );
}

module.exports = {
  listVolunteers,
  listActiveVolunteers,
  createVolunteer
};

