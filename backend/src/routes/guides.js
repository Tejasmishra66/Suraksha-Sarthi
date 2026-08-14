const express = require("express");
const { db } = require("../db/database");
const router = express.Router();

// GET /guides - Fetch survival guides for offline caching
router.get("/", async (, ) => {
  try {
    const guides = db.prepare("SELECT * FROM offline_guides").all();
    res.json(guides);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch offline guides" });
  }
});

module.exports = router;