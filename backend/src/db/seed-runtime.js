const bcrypt = require("bcryptjs");
const { db } = require("./database");

async function hasRows(tableName) {
  const row = await db.prepare(`SELECT COUNT(*) AS count FROM ${tableName}`).get();
  return row.count > 0;
}

async function runSeed() {
  // Seeds data once for dev startup if DB is empty.
  if (!await hasRows("users")) {
    const passwordHash = bcrypt.hashSync("password123", 10);
    const insert = db.prepare(
      "INSERT INTO users (name, email, password_hash, role, agency, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    await insert.run("SDRF Officer", "officer@sdrf.local", passwordHash, "admin", "SDRF", "+919000000000", "HQ, SDRF Campus");
    await insert.run("Police Head", "police@sdrf.local", passwordHash, "agency_head", "Police", "+919000000001", "Police HQ");
    await insert.run("Medical Head", "medical@sdrf.local", passwordHash, "agency_head", "Medical", "+919000000002", "Medical Directorate");
    await insert.run("Power Grid Head", "utility@sdrf.local", passwordHash, "agency_head", "Utility", "+919000000003", "Power Grid Office");
  }

  // All other fake data seeds removed for production
}

module.exports = {
  runSeed
};
