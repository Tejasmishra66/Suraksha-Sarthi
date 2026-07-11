const { db } = require("../db/database");

function listIntelPins() {
  return db
    .prepare(
      `SELECT id, lat, lon, department, note, timestamp, office_tags
       FROM intel_pins
       ORDER BY datetime(timestamp) DESC, id DESC`
    )
    .all();
}

function createIntelPin({ lat, lon, department, note, officeTags }) {
  return db.prepare("INSERT INTO intel_pins (lat, lon, department, note, office_tags) VALUES (?, ?, ?, ?, ?)").run(lat, lon, department, note, JSON.stringify(officeTags || []));
}

module.exports = {
  listIntelPins,
  createIntelPin
};