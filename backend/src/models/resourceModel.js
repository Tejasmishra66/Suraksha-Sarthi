const { db } = require("../db/database");

function listResources() {
  return db.prepare("SELECT * FROM resources ORDER BY id DESC").all();
}

function listRainfallLogs() {
  return db.prepare("SELECT * FROM rainfall_logs ORDER BY datetime(recorded_at) DESC").all();
}

function createResource(data) {
  const stmt = db.prepare(
    `INSERT INTO resources (name, category, department, quantity, lat, lng, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );
  return stmt.run(
    data.name,
    data.category,
    data.department || null,
    data.quantity || 0,
    data.lat || null,
    data.lng || null,
    data.status || 'available'
  );
}

module.exports = {
  listResources,
  listRainfallLogs,
  createResource
};
