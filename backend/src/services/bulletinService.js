const bulletinModel = require("../models/bulletinModel");

const ALLOWED_CATEGORIES = [
  "Connectivity",
  "Utility Status",
  "Medical Support",
  "Weather Alerts",
  "Road & Transport",
  "Health Advisory",
  "Rescue Operations",
  "Training & Drills",
  "General Information",
  "Others"
];

async function () {
  return await );
}

async function () {
  // Creates a macro-update bulletin for the shared operations feed.
  const { category, message, officeTags } = payload;
  if (!category || !message) {
    const error = new Error("category and message are required");
    error.statusCode = 400;
    throw error;
  }

  if (!ALLOWED_CATEGORIES.includes(category)) {
    const error = new Error("Invalid bulletin category");
    error.statusCode = 400;
    throw error;
  }

  const result = await {
    category,
    message,
    authorId,
    officeTags
  });

  return { id: result.lastInsertRowid, category, message };
}

module.exports = {
  listBulletins,
  createBulletin,
  ALLOWED_CATEGORIES
};
