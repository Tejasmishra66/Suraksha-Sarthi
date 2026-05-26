const { db } = require("../db/database");

function listBulletins() {
  return db
    .prepare(
      `SELECT b.id, b.category, b.message, b.author_id, b.timestamp, u.name AS author_name, u.agency AS author_agency
       FROM bulletins b
       LEFT JOIN users u ON u.id = b.author_id
       ORDER BY datetime(b.timestamp) DESC, b.id DESC`
    )
    .all();
}

function createBulletin({ category, message, authorId }) {
  return db
    .prepare(
      "INSERT INTO bulletins (category, message, author_id) VALUES (?, ?, ?)"
    )
    .run(category, message, authorId);
}

module.exports = {
  listBulletins,
  createBulletin
};
