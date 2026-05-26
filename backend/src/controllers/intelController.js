const intelService = require("../services/intelService");

function listIntel(_req, res) {
  return res.json(intelService.listIntelPins());
}

function createIntel(req, res) {
  return res.status(201).json(intelService.createIntelPin(req.body));
}

module.exports = {
  listIntel,
  createIntel
};