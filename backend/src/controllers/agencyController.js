const agencyService = require("../services/agencyService");

async function () {
  return res.json(agencyService.listAgencies());
}

module.exports = {
  listAgencies
};