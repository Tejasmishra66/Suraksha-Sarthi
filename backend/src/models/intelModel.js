const { db } = require("../db/database");

function listIntelPins() {
  return db
    .prepare(
      `SELECT id, lat, lon, department, note, timestamp
       FROM intel_pins
       ORDER BY datetime(timestamp) DESC, id DESC`
    )
    .all();
}

function createIntelPin({ lat, lon, department, note }) {
  return db.prepare("INSERT INTO intel_pins (lat, lon, department, note) VALUES (?, ?, ?, ?)").run(lat, lon, department, note);
}

module.exports = {
  listIntelPins,
  createIntelPin
};