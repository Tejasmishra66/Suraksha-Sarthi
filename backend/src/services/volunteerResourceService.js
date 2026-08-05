const volunteerModel = require("../models/volunteerModel");
const resourceModel = require("../models/resourceModel");
const trainingKitModel = require("../models/trainingKitModel");
const { findVolunteersInRadius } = require("./alertingService");

function listVolunteers() {
  return volunteerModel.listVolunteers();
}

function createVolunteer(data) {
  return volunteerModel.createVolunteer(data);
}

function broadcastWithinRadius({ lat, lng, radiusKm = 10, skills = [] }) {
  // Returns matching volunteers for active radius broadcast.
  if (lat == null || lng == null) {
    const error = new Error("lat and lng are required");
    error.statusCode = 400;
    throw error;
  }

  const matches = findVolunteersInRadius(Number(lat), Number(lng), Number(radiusKm), skills);
  return { total: matches.length, matches };
}

function listResources() {
  return resourceModel.listResources();
}

function createResource(data) {
  return resourceModel.createResource(data);
}

function listRainfallLogs() {
  return resourceModel.listRainfallLogs();
}

function listTrainingKits() {
  return trainingKitModel.listTrainingKits();
}

function updateResourceStatus(id, status) {
  return resourceModel.updateResourceStatus(id, status);
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

