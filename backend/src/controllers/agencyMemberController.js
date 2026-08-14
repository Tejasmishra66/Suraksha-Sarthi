const agencyMemberService = require("../services/agencyMemberService");

async function () {
  return res.json(agencyMemberService.listAgencyMembers(req.params.agency));
}

async function () {
  const result = agencyMemberService.createAgencyMember({
    agency: req.params.agency,
    name: req.body.name,
    role: req.body.role,
    phone: req.body.phone,
    address: req.body.address
  });

  return res.status(201).json(result);
}

module.exports = {
  listMembers,
  createMember
};