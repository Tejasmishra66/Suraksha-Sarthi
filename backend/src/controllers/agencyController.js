const agencyService = require("../services/agencyService");

function listAgencies(_req, res) {
  return res.json(agencyService.listAgencies());
}

module.exports = {
  listAgencies
};