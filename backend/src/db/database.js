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

const { Pool } = require("pg");

if (!process.env.POSTGRES_URL) {
  logger.warn("POSTGRES_URL is missing. Please set it in your environment variables to connect to Neon/Supabase.");
}

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || "postgres://localhost:5432/sdrf",
  ssl: { rejectUnauthorized: false }
});

const db = {
  prepare: (sql) => {
    let paramIndex = 1;
    let pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
    
    // Auto-append RETURNING id for INSERT queries to support lastInsertRowid
    if (pgSql.trim().toUpperCase().startsWith('INSERT') && !pgSql.toUpperCase().includes('RETURNING')) {
      pgSql += ' RETURNING id';
    }

    return {
      run: async (...params) => {
        const res = await pool.query(pgSql, params);
        let lastInsertRowid = null;
        if (res.rows && res.rows.length > 0 && res.rows[0].id) {
           lastInsertRowid = res.rows[0].id;
        }
        return { changes: res.rowCount, lastInsertRowid };
      },
      all: async (...params) => {
        const res = await pool.query(pgSql, params);
        return res.rows;
      },
      get: async (...params) => {
        const res = await pool.query(pgSql, params);
        return res.rows[0];
      }
    };
  },
  exec: async (sql) => {
    await pool.query(sql);
  },
  close: async () => {
    await pool.end();
  }
};

function getTableColumns(tableName) {

async function runMigrations() {
  const schemaPath = path.resolve(__dirname, "schema.postgres.sql");
  const sql = fs.readFileSync(schemaPath, "utf-8");
  await db.exec(sql);

  await db.prepare(
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

  await seedDemoEquipment();
}

async function seedDemoEquipment() {
  try {
    const countRes = await db.prepare("SELECT COUNT(*) as cnt FROM equipment").get();
    if (countRes && parseInt(countRes.cnt) >= 5) {
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
      INSERT INTO equipment (qr_code, name, category, department, quantity, place, status, lat, lng)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT DO NOTHING
    `);

    for (const item of demoItems) {
      await insert.run(item.qr_code, item.name, item.category, item.department, item.quantity, item.place, item.status, item.lat, item.lng);
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

// Gracefully close the database on process exit
function closeDb() {
  try {
    db.close();
  } catch (_) {
    // Already closed or never opened
  }
}
process.on("exit", closeDb);
process.on("SIGINT", () => { closeDb(); process.exit(0); });
process.on("SIGTERM", () => { closeDb(); process.exit(0); });
