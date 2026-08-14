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
  ensureColumn("volunteers", "skills", "skills TEXT");
  ensureColumn("volunteers", "aadhaar", "aadhaar TEXT");
  ensureColumn("volunteers", "certification_url", "certification_url TEXT");
  ensureColumn("volunteers", "aadhaar_front_url", "aadhaar_front_url TEXT");
  ensureColumn("volunteers", "aadhaar_back_url", "aadhaar_back_url TEXT");
  ensureColumn("volunteers", "district", "district TEXT");
  ensureColumn("volunteers", "user_id", "user_id INTEGER");
  ensureColumn("volunteers", "status", "status TEXT DEFAULT 'pending'");
  ensureColumn("tasks", "notification_agencies", "notification_agencies TEXT");
  
  ensureColumn("incidents", "office_tags", "office_tags TEXT");
  ensureColumn("incidents", "reporter_phone", "reporter_phone TEXT");
  ensureColumn("tasks", "office_tags", "office_tags TEXT");
  ensureColumn("bulletins", "office_tags", "office_tags TEXT");
  ensureColumn("alerts", "office_tags", "office_tags TEXT");
  ensureColumn("intel_pins", "office_tags", "office_tags TEXT");

  ensureColumn("equipment", "department", "department TEXT");
  ensureColumn("equipment", "quantity", "quantity INTEGER DEFAULT 1");
  ensureColumn("equipment", "place", "place TEXT");
  ensureColumn("equipment", "maintenance_reason", "maintenance_reason TEXT");
  ensureColumn("equipment_transfers", "sender_hq", "sender_hq TEXT");
  ensureColumn("equipment_transfers", "receiver_hq", "receiver_hq TEXT");

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

  seedDemoEquipment();
}

function seedDemoEquipment() {
  try {
    const count = db.prepare("SELECT COUNT(*) as cnt FROM equipment").get();
    if (count && count.cnt >= 5) {
      return;
    }

    const demoItems = [
      { qr_code: 'EQ-1001', name: 'Inflatable Rescue Boat (IRB 40HP)', category: 'Rescue Gear', department: 'SDRF Shimla HQ', quantity: 3, place: 'Shimla HQ', status: 'available', lat: 31.1048, lng: 77.1734 },
      { qr_code: 'EQ-1002', name: 'Stihl MS-382 Heavy Duty Chainsaw', category: 'Rescue Gear', department: 'SDRF Shimla HQ', quantity: 6, place: 'Shimla HQ', status: 'available', lat: 31.1048, lng: 77.1734 },
      { qr_code: 'EQ-1003', name: 'High-Capacity Sludge Water Pump 10HP', category: 'Rescue Gear', department: 'SDRF Shimla HQ', quantity: 4, place: 'Shimla HQ', status: 'available', lat: 31.1048, lng: 77.1734 },
      { qr_code: 'EQ-1004', name: 'ISATPhone Satellite Communication Set', category: 'Communication', department: 'SDRF Shimla HQ', quantity: 2, place: 'Shimla HQ', status: 'available', lat: 31.1048, lng: 77.1734 },
      { qr_code: 'EQ-2001', name: 'Hydraulic Cutter & Spreader Rescue Kit', category: 'Rescue Gear', department: 'SDRF Mandi HQ', quantity: 2, place: 'Mandi HQ', status: 'available', lat: 31.7084, lng: 76.9320 },
      { qr_code: 'EQ-2002', name: 'Emergency Trauma & First Aid Kit (Level 3)', category: 'Medical', department: 'SDRF Mandi HQ', quantity: 10, place: 'Mandi HQ', status: 'available', lat: 31.7084, lng: 76.9320 },
      { qr_code: 'EQ-2003', name: 'Portable Silent Diesel Generator 5kW', category: 'Power & Light', department: 'SDRF Mandi HQ', quantity: 5, place: 'Mandi HQ', status: 'available', lat: 31.7084, lng: 76.9320 },
      { qr_code: 'EQ-2004', name: 'All-Terrain 4x4 Disaster Rescue Vehicle', category: 'Vehicles', department: 'SDRF Mandi HQ', quantity: 2, place: 'Mandi HQ', status: 'available', lat: 31.7084, lng: 76.9320 },
      { qr_code: 'EQ-3001', name: 'SCUBA Deep Diving & Rescue Apparatus', category: 'Rescue Gear', department: 'SDRF Kangra HQ', quantity: 4, place: 'Kangra HQ', status: 'available', lat: 32.2190, lng: 76.3234 },
      { qr_code: 'EQ-3002', name: 'High-Altitude Mountain Rescue Gear Set', category: 'Rescue Gear', department: 'SDRF Kangra HQ', quantity: 8, place: 'Kangra HQ', status: 'available', lat: 32.2190, lng: 76.3234 },
      { qr_code: 'EQ-3003', name: 'High-Lumen Telescopic LED Light Tower', category: 'Power & Light', department: 'SDRF Kangra HQ', quantity: 6, place: 'Kangra HQ', status: 'available', lat: 32.2190, lng: 76.3234 },
      { qr_code: 'EQ-3004', name: 'Motorola VHF Tactical Handheld Set (x15)', category: 'Communication', department: 'SDRF Kangra HQ', quantity: 15, place: 'Kangra HQ', status: 'available', lat: 32.2190, lng: 76.3234 },
    ];

    const insert = db.prepare(`
      INSERT OR IGNORE INTO equipment (qr_code, name, category, department, quantity, place, status, lat, lng)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const item of demoItems) {
      insert.run(item.qr_code, item.name, item.category, item.department, item.quantity, item.place, item.status, item.lat, item.lng);
    }
    logger.info(`Seeded ${demoItems.length} demo SDRF equipment items across Shimla, Mandi, and Kangra HQs.`);
  } catch (e) {
    logger.error("Failed to seed demo equipment:", e);
  }
}

module.exports = {
  db,
  runMigrations
};
