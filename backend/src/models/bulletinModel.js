const { db } = require("../db/database");

function listBulletins() {
  return db.prepare("SELECT * FROM macro_updates ORDER BY pinned DESC, datetime(created_at) DESC").all();
}

function createBulletin({ title, body, category, pinned, lat, lng, createdBy }) {
  return db
    .prepare(
      "INSERT INTO macro_updates (title, body, category, pinned, lat, lng, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .run(title, body, category, pinned ? 1 : 0, lat, lng, createdBy);
}

module.exports = {
  listBulletins,
  createBulletin
};
