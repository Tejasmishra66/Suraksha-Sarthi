const incidentModel = require("../models/incidentModel");

function verifyIncident(incidentId, officerId) {
  // Transitions incident verification state to Verified.
  const incident = incidentModel.getIncidentById(incidentId);
  if (!incident) {
    const error = new Error("Incident not found");
    error.statusCode = 404;
    throw error;
  }

  incidentModel.verifyIncident(incidentId, officerId);
  return {
    id: incidentId,
    verificationState: "Verified",
    verifiedBy: officerId
  };
}

function listIncidents(onlyVerified) {
  return incidentModel.listIncidentsByVerification(Boolean(onlyVerified));
}

module.exports = {
  verifyIncident,
  listIncidents
};
