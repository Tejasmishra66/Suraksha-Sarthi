const statusService = require("../services/statusService");

function ping(req, res) {
  return res.json(
    statusService.recordHeartbeat({
      userId: req.body.user_id || req.user.id,
      location: req.body.location || null
    })
  );
}

module.exports = {
  ping
};
