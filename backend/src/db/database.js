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
  ensureColumn("users", "department", "department TEXT");
  ensureColumn("users", "place", "place TEXT");
  ensureColumn("users", "district", "district TEXT");
  ensureColumn("volunteers", "place", "place TEXT");
  ensureColumn("tasks", "notification_agencies", "notification_agencies TEXT");
  
  ensureColumn("incidents", "office_tags", "office_tags TEXT");
  ensureColumn("tasks", "office_tags", "office_tags TEXT");
  ensureColumn("bulletins", "office_tags", "office_tags TEXT");
  ensureColumn("alerts", "office_tags", "office_tags TEXT");
  ensureColumn("intel_pins", "office_tags", "office_tags TEXT");

  seedAgencyHeadPhones();

  // Initialize tables for Equipment Tracking (Asset Management) and Offline Guides
  db.exec(`
    CREATE TABLE IF NOT EXISTS equipment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      qr_code TEXT UNIQUE,
      name TEXT,
      category TEXT,
      status TEXT DEFAULT 'available', -- available, dispatched, in_use
      lat REAL,
      lng REAL,
      last_scanned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      current_owner_id INTEGER
    );

    CREATE TABLE IF NOT EXISTS equipment_transfers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      equipment_id INTEGER,
      sender_id INTEGER,
      receiver_id INTEGER,
      status TEXT, -- dispatched, confirmed
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS offline_guides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      version INTEGER DEFAULT 1,
      download_url TEXT
    );

    CREATE TABLE IF NOT EXISTS muted_alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      alert_id TEXT NOT NULL,
      alert_type TEXT NOT NULL, -- 'incident', 'task', 'bulletin', 'alert'
      office TEXT NOT NULL,
      muted_by INTEGER,
      muted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      office TEXT,
      action TEXT NOT NULL,
      entity_type TEXT,
      entity_id TEXT,
      details TEXT,
      ip_address TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS web_push_subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      office TEXT,
      endpoint TEXT UNIQUE NOT NULL,
      p256dh TEXT NOT NULL,
      auth TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

module.exports = {
  db,
  runMigrations
};
