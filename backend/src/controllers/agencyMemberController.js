const agencyMemberService = require("../services/agencyMemberService");

function listMembers(req, res) {
  return res.json(agencyMemberService.listAgencyMembers(req.params.agency));
}

function createMember(req, res) {
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