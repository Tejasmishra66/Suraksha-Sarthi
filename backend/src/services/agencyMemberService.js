const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { db } = require("../db/database");

function listAgencyMembers(agency) {
  if (!agency) {
    const error = new Error("agency is required");
    error.statusCode = 400;
    throw error;
  }

  return db
    .prepare(
      `SELECT id, name, role, agency, phone, address, email
       FROM users
       WHERE agency = ?
       ORDER BY id DESC`
    )
    .all(agency);
}

function createAgencyMember({ agency, name, role, phone, address }) {
  if (!agency || !name || !role || !phone) {
    const error = new Error("agency, name, role, and phone are required");
    error.statusCode = 400;
    throw error;
  }

  const normalizedRole = String(role).trim().toLowerCase();
  if (!["officer", "volunteer", "worker"].includes(normalizedRole)) {
    const error = new Error("role must be officer, volunteer, or worker");
    error.statusCode = 400;
    throw error;
  }

  const phoneDigits = String(phone).replace(/\D/g, "");
  const uniqueToken = crypto.randomBytes(4).toString("hex");
  const email = `${String(agency).toLowerCase().replace(/[^a-z0-9]+/g, ".")}.${phoneDigits || "member"}.${uniqueToken}@sdrf.local`;
  const passwordHash = bcrypt.hashSync(crypto.randomBytes(8).toString("hex"), 10);

  const result = db
    .prepare(
      "INSERT INTO users (name, email, password_hash, role, agency, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .run(name.trim(), email, passwordHash, normalizedRole, agency, String(phone).trim(), address || null);

  return { id: result.lastInsertRowid, email };
}

module.exports = {
  listAgencyMembers,
  createAgencyMember
};