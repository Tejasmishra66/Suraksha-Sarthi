const express = require("express");
const { db } = require("../db/database");
const { toCsv } = require("../services/csvService");

const router = express.Router();

router.get("/incidents", (_req, res) => {
  const rows = db.prepare("SELECT * FROM incidents ORDER BY created_at DESC").all();
  const csv = toCsv(rows);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="incidents.csv"');
  return res.send(csv);
});

router.get("/resources.csv", (_req, res) => {
  // Exports current resource inventory as CSV.
  const rows = db.prepare("SELECT id, name, category, quantity, status, created_at FROM resources").all();
  const csv = toCsv(rows);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="resources.csv"');
  return res.send(csv);
});

router.get("/rainfall.csv", (_req, res) => {
  // Exports rainfall logs for analytics/reporting.
  const rows = db.prepare("SELECT id, location, mm, recorded_at FROM rainfall_logs").all();
  const csv = toCsv(rows);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="rainfall.csv"');
  return res.send(csv);
});

module.exports = router;
