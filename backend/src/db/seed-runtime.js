const bcrypt = require("bcryptjs");
const { db } = require("./database");

function hasRows(tableName) {
  const row = db.prepare(`SELECT COUNT(*) AS count FROM ${tableName}`).get();
  return row.count > 0;
}

function runSeed() {
  // Seeds data once for dev startup if DB is empty.
  if (!hasRows("users")) {
    const passwordHash = bcrypt.hashSync("password123", 10);
    const insert = db.prepare(
      "INSERT INTO users (name, email, password_hash, role, agency, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    insert.run("SDRF Officer", "officer@sdrf.local", passwordHash, "admin", "SDRF", "+919000000000", "HQ, SDRF Campus");
    insert.run("Police Head", "police@sdrf.local", passwordHash, "agency_head", "Police", "+919000000001", "Police HQ");
    insert.run("Medical Head", "medical@sdrf.local", passwordHash, "agency_head", "Medical", "+919000000002", "Medical Directorate");
    insert.run("Power Grid Head", "utility@sdrf.local", passwordHash, "agency_head", "Utility", "+919000000003", "Power Grid Office");
  }

  // All other fake data seeds removed for production
}

module.exports = {
  runSeed
};
