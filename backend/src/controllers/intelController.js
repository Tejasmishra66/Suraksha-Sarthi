const intelService = require("../services/intelService");
const filterByOffice = require("../utils/officeFilter");

function listIntel(req, res) {
  const intel = intelService.listIntelPins();
  return res.json(filterByOffice(intel, req.user));
}

function createIntel(req, res) {
  return res.status(201).json(intelService.createIntelPin({ ...req.body, officeTags: req.body.officeTags }));
}

module.exports = {
  listIntel,
  createIntel
};