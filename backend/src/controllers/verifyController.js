const verificationService = require("../services/verificationService");

async function () {
  return res.json(verificationService.verifyIncident(Number(req.params.incidentId), req.user.id));
}

async function () {
  const onlyVerified = String(req.query.onlyVerified || "true") === "true";
  return res.json(verificationService.listIncidents(onlyVerified));
}

module.exports = {
  verify,
  list
};
