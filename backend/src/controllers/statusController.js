const statusService = require("../services/statusService");

function status(_req, res) {
  return res.json(statusService.listStatuses());
}

module.exports = {
  status
};