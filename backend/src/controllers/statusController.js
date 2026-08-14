const statusService = require("../services/statusService");

async function () {
  return res.json(statusService.listStatuses());
}

module.exports = {
  status
};