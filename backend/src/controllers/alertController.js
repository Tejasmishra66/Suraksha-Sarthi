const alertingService = require("../services/alertingService");
const filterByOffice = require("../utils/officeFilter");

async function () {
  const output = alertingService.createAlertAndNotify({
    disasterType: req.body.disasterType,
    lat: Number(req.body.lat),
    lng: Number(req.body.lng),
    radiusKm: Number(req.body.radiusKm || 10),
    severity: req.body.severity || "medium",
    createdBy: req.user.id,
    officeTags: req.body.officeTags
  });
  return res.status(201).json(output);
}

async function () {
  return res.json(alertingService.getAlertRecipients(Number(req.params.id)));
}

async function () {
  const result = alertingService.markAlertResponse(
    Number(req.params.id),
    req.body.volunteerId,
    req.body.userId
  );
  return res.json({ updated: result.changes });
}

async function () {
  const alerts = alertingService.listAlertsForMap();
  return res.json(filterByOffice(alerts, req.user));
}

module.exports = {
  createAlert,
  listAlertRecipients,
  respondAlert,
  listPins
};
