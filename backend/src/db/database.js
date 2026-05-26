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

function getTableColumns(tableName) {
  return db.prepare(`PRAGMA table_info(${tableName})`).all().map((row) => row.name);
}

function ensureColumn(tableName, columnName, columnDefinition) {
  const columns = getTableColumns(tableName);
  if (!columns.includes(columnName)) {
    db.prepare(`ALTER TABLE ${tableName} ADD COLUMN ${columnDefinition}`).run();
  }
}

function seedAgencyHeadPhones() {
  db.prepare(
    `UPDATE users
     SET phone = CASE agency
       WHEN 'SDRF' THEN '+919000000000'
       WHEN 'Police' THEN '+919000000001'
       WHEN 'Medical' THEN '+919000000002'
       WHEN 'Utility' THEN '+919000000003'
       WHEN 'Connectivity' THEN '+919000000004'
       WHEN 'Fire Brigade' THEN '+919000000005'
       WHEN 'HPEB' THEN '+919000000006'
       ELSE phone
     END
     WHERE role = 'agency_head' AND (phone IS NULL OR phone = '')`
  ).run();
}

function runMigrations() {
  // Initializes all core tables for MVP features.
  const schemaPath = path.resolve(__dirname, "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf-8");
  db.exec(sql);

  ensureColumn("users", "phone", "phone TEXT");
  ensureColumn("users", "address", "address TEXT");
  ensureColumn("volunteers", "place", "place TEXT");
  ensureColumn("tasks", "notification_agencies", "notification_agencies TEXT");
  seedAgencyHeadPhones();
}

module.exports = {
  db,
  runMigrations
};
