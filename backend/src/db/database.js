const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const env = require("../config/env");
const logger = require("../utils/logger");

if (env.dbClient !== "sqlite") {
  logger.warn(
    "DB_CLIENT is set to non-sqlite. This MVP runtime executes SQLite paths; see src/db/postgres-switch.md for migration steps."
  );
}

const dbDirectory = path.dirname(env.dbPath);
if (!fs.existsSync(dbDirectory)) {
  fs.mkdirSync(dbDirectory, { recursive: true });
}

const db = new Database(env.dbPath);
db.pragma("journal_mode = WAL");

function runMigrations() {
  // Initializes all core tables for MVP features.
  const schemaPath = path.resolve(__dirname, "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf-8");
  db.exec(sql);
}

module.exports = {
  db,
  runMigrations
};
