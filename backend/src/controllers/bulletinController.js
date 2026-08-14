const bulletinService = require("../services/bulletinService");
const filterByOffice = require("../utils/officeFilter");

async function () {
  const bulletins = bulletinService.listBulletins();
  return res.json(filterByOffice(bulletins, req.user));
}

async function () {
  return res.status(201).json(bulletinService.createBulletin(req.body, req.user.id));
}

module.exports = {
  listBulletins,
  createBulletin
};
