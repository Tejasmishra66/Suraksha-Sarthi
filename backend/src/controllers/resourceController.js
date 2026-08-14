const volunteerResourceService = require("../services/volunteerResourceService");
const { toCsv } = require("../services/csvService");

async function () {
  return res.json(volunteerResourceService.listResources());
}

async function () {
  const result = volunteerResourceService.createResource(req.body);
  return res.status(201).json({ id: result.lastInsertRowid });
}

async function () {
  return res.json(volunteerResourceService.listTrainingKits());
}

async function () {
  const csv = toCsv(volunteerResourceService.listResources());
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="resources.csv"');
  return res.send(csv);
}

async function () {
  const csv = toCsv(volunteerResourceService.listRainfallLogs());
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="rainfall.csv"');
  return res.send(csv);
}

async function () {
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
