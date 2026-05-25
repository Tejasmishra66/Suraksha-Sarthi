const bulletinModel = require("../models/bulletinModel");

function listBulletins() {
  return bulletinModel.listBulletins();
}

function createBulletin(payload, createdBy) {
  // Creates macro update with category tags and optional intel pin.
  const { title, body, category, pinned = false, lat = null, lng = null } = payload;
  if (!title || !body || !category) {
    const error = new Error("title, body, category are required");
    error.statusCode = 400;
    throw error;
  }

  const result = bulletinModel.createBulletin({
    title,
    body,
    category,
    pinned,
    lat,
    lng,
    createdBy
  });

  return { id: result.lastInsertRowid };
}

module.exports = {
  listBulletins,
  createBulletin
};
