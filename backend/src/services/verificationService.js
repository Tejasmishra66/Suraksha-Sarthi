const incidentModel = require("../models/incidentModel");

async function () {
  // Transitions incident verification state to Verified.
  const incident = await incidentId);
  if (!incident) {
    const error = new Error("Incident not found");
    error.statusCode = 404;
    throw error;
  }

  await incidentId, officerId);
  return {
    id: incidentId,
    verificationState: "Verified",
    verifiedBy: officerId
  };
}

async function () {
  return await Boolean(onlyVerified));
}

module.exports = {
  verifyIncident,
  listIncidents
};
