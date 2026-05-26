const { db } = require("../db/database");

const AGENCY_CATALOG = [
  "SDRF",
  "Police",
  "Medical",
  "Utility",
  "Connectivity",
  "Fire Brigade",
  "HPEB"
];

function listAgencies() {
  const userAgencies = db
    .prepare(
      `SELECT DISTINCT agency
       FROM users
       WHERE role = 'agency_head'
         AND agency IS NOT NULL
         AND agency != ''
       ORDER BY agency ASC`
    )
    .all()
    .map((row) => row.agency);

  return [...new Set([...AGENCY_CATALOG, ...userAgencies])];
}

module.exports = {
  listAgencies
};