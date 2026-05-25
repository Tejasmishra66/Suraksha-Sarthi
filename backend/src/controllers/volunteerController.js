const volunteerResourceService = require("../services/volunteerResourceService");

function listVolunteers(_req, res) {
  return res.json(volunteerResourceService.listVolunteers());
}

function broadcast(req, res) {
  const result = volunteerResourceService.broadcastWithinRadius({
    lat: req.body.lat,
    lng: req.body.lng,
    radiusKm: req.body.radiusKm,
    skills: req.body.skills || []
  });
  return res.json(result);
}

function createVolunteer(req, res) {
  const result = volunteerResourceService.createVolunteer(req.body);
  return res.status(201).json({ id: result.lastInsertRowid });
}

module.exports = {
  listVolunteers,
  broadcast,
  createVolunteer
};
