const alertingService = require("../services/alertingService");

function createAlert(req, res) {
  const output = alertingService.createAlertAndNotify({
    disasterType: req.body.disasterType,
    lat: Number(req.body.lat),
    lng: Number(req.body.lng),
    radiusKm: Number(req.body.radiusKm || 10),
    severity: req.body.severity || "medium",
    createdBy: req.user.id
  });
  return res.status(201).json(output);
}

function listAlertRecipients(req, res) {
  return res.json(alertingService.getAlertRecipients(Number(req.params.id)));
}

function respondAlert(req, res) {
  const result = alertingService.markAlertResponse(
    Number(req.params.id),
    req.body.volunteerId,
    req.body.userId
  );
  return res.json({ updated: result.changes });
}

function listPins(_req, res) {
  return res.json(alertingService.listAlertsForMap());
}

module.exports = {
  createAlert,
  listAlertRecipients,
  respondAlert,
  listPins
};
