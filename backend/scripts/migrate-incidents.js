const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'data', 'sdrf.db');
const db = new Database(dbPath);

function columnInfo(tableName) {
  return db.prepare(`PRAGMA table_info('${tableName}')`).all();
}

function migrateIncidents() {
  const cols = columnInfo('incidents');
  const names = cols.map((col) => col.name);
  const hasAddress = names.includes('address');
  const latNotNull = cols.find((col) => col.name === 'lat')?.notnull === 1;
  const lngNotNull = cols.find((col) => col.name === 'lng')?.notnull === 1;

  if (hasAddress && !latNotNull && !lngNotNull) {
    console.log('incidents table already migrated');
    return;
  }

  const copyColumns = [
    'id',
    'title',
    'description',
    'disaster_type',
    'lat',
    'lng',
    'status',
    'agency_assigned',
    'verification_state',
    'verified_by',
    'verified_at',
    'media_hash',
    'media_timestamp',
    'media_gps',
    'media_ref',
    'created_at'
  ];

  db.pragma('foreign_keys = OFF');
  const migrate = db.transaction(() => {
    db.exec('ALTER TABLE incidents RENAME TO incidents_old');
    db.exec(`
      CREATE TABLE incidents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        disaster_type TEXT NOT NULL,
        lat REAL,
        lng REAL,
        address TEXT,
        status TEXT DEFAULT 'New',
        agency_assigned TEXT,
        verification_state TEXT DEFAULT 'Unverified',
        verified_by INTEGER,
        verified_at TEXT,
        media_hash TEXT,
        media_timestamp TEXT,
        media_gps TEXT,
        media_ref TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (verified_by) REFERENCES users(id)
      )
    `);
    db.exec(`INSERT INTO incidents (${copyColumns.join(', ')}) SELECT ${copyColumns.join(', ')} FROM incidents_old`);
    db.exec('DROP TABLE incidents_old');
  });

  migrate();
  db.pragma('foreign_keys = ON');
  console.log('incidents migration complete');
}

migrateIncidents();
