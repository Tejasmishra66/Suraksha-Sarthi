const incidentService = require("../services/incidentService");

function listIncidents(_req, res) {
  return res.json(incidentService.listIncidents());
}

function createIncident(req, res) {
  return res.status(201).json(incidentService.createIncident(req.body));
}

function uploadMedia(req, res) {
  const result = incidentService.attachIncidentMedia(Number(req.params.id), req.file, {
    timestamp: req.body.timestamp,
    gps: req.body.gps
  });
  return res.status(201).json(result);
}

module.exports = {
  listIncidents,
  createIncident,
  uploadMedia
};
