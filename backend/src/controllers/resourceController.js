const volunteerResourceService = require("../services/volunteerResourceService");
const { toCsv } = require("../services/csvService");

function listResources(_req, res) {
  return res.json(volunteerResourceService.listResources());
}

function createResource(req, res) {
  const result = volunteerResourceService.createResource(req.body);
  return res.status(201).json({ id: result.lastInsertRowid });
}

function listTrainingKits(_req, res) {
  return res.json(volunteerResourceService.listTrainingKits());
}

function exportResourcesCsv(_req, res) {
  const csv = toCsv(volunteerResourceService.listResources());
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="resources.csv"');
  return res.send(csv);
}

function exportRainfallCsv(_req, res) {
  const csv = toCsv(volunteerResourceService.listRainfallLogs());
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="rainfall.csv"');
  return res.send(csv);
}

function updateResourceStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  volunteerResourceService.updateResourceStatus(id, status);
  return res.json({ success: true, id, status });
}

module.exports = {
  listResources,
  createResource,
  listTrainingKits,
  exportResourcesCsv,
  exportRainfallCsv,
  updateResourceStatus
};
