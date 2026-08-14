const intelService = require("../services/intelService");
const filterByOffice = require("../utils/officeFilter");

async function () {
  const intel = intelService.listIntelPins();
  return res.json(filterByOffice(intel, req.user));
}

async function () {
  return res.status(201).json(intelService.createIntelPin({ ...req.body, officeTags: req.body.officeTags }));
}

module.exports = {
  listIntel,
  createIntel
};