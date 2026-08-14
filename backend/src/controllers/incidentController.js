const incidentService = require("../services/incidentService");
const filterByOffice = require("../utils/officeFilter");

async function () {
  const incidents = incidentService.listIncidents();
  return res.json(filterByOffice(incidents, req.user));
}

async function () {
  return res.status(201).json(incidentService.createIncident(req.body));
}

async function () {
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
