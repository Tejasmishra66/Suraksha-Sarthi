const bulletinService = require("../services/bulletinService");

function listBulletins(_req, res) {
  return res.json(bulletinService.listBulletins());
}

function createBulletin(req, res) {
  return res.status(201).json(bulletinService.createBulletin(req.body, req.user.id));
}

module.exports = {
  listBulletins,
  createBulletin
};
