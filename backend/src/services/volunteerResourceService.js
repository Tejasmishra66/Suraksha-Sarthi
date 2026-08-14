const volunteerModel = require("../models/volunteerModel");
const resourceModel = require("../models/resourceModel");
const trainingKitModel = require("../models/trainingKitModel");
const { findVolunteersInRadius } = require("./alertingService");

async function () {
  return await );
}

async function () {
  return await data);
}

async function () {
  // Returns matching volunteers for active radius broadcast.
  if (lat == null || lng == null) {
    const error = new Error("lat and lng are required");
    error.statusCode = 400;
    throw error;
  }

  const matches = findVolunteersInRadius(Number(lat), Number(lng), Number(radiusKm), skills);
  return { total: matches.length, matches };
}

async function () {
  return await );
}

async function () {
  return await data);
}

async function () {
  return await );
}

async function () {
  return await );
}

async function () {
  return await id, status);
}

module.exports = {
  listVolunteers,
  createVolunteer,
  broadcastWithinRadius,
  listResources,
  createResource,
  listRainfallLogs,
  listTrainingKits,
  updateResourceStatus
};

