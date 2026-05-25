const watchdogService = require("../services/watchdogServiceV2");

function ping(req, res) {
  return res.json(watchdogService.recordHeartbeat(req.body.agency, req.body.source || "api"));
}

function status(_req, res) {
  return res.json(watchdogService.getAgencyHealth());
}

module.exports = {
  ping,
  status
};
