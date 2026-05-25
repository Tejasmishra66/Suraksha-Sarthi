const verificationService = require("../services/verificationService");

function verify(req, res) {
  return res.json(verificationService.verifyIncident(Number(req.params.incidentId), req.user.id));
}

function list(req, res) {
  const onlyVerified = String(req.query.onlyVerified || "true") === "true";
  return res.json(verificationService.listIncidents(onlyVerified));
}

module.exports = {
  verify,
  list
};
