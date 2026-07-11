const bulletinService = require("../services/bulletinService");
const filterByOffice = require("../utils/officeFilter");

function listBulletins(req, res) {
  const bulletins = bulletinService.listBulletins();
  return res.json(filterByOffice(bulletins, req.user));
}

function createBulletin(req, res) {
  return res.status(201).json(bulletinService.createBulletin(req.body, req.user.id));
}

module.exports = {
  listBulletins,
  createBulletin
};
