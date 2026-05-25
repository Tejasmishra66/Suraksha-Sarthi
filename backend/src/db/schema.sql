CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  agency TEXT
);

CREATE TABLE IF NOT EXISTS volunteers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  capabilities TEXT NOT NULL,
  terrain_restrictions TEXT,
  department TEXT,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  department TEXT,
  quantity INTEGER NOT NULL,
  lat REAL,
  lng REAL,
  status TEXT DEFAULT 'available',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS incidents (
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
);

CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  incident_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  details TEXT,
  assigned_agency TEXT,
  status TEXT DEFAULT 'New',
  created_by INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (incident_id) REFERENCES incidents(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  disaster_type TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  radius_km REAL DEFAULT 10,
  severity TEXT DEFAULT 'medium',
  created_by INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  escalated INTEGER DEFAULT 0,
  escalation_at TEXT,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS alert_recipients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  alert_id INTEGER NOT NULL,
  volunteer_id INTEGER,
  user_id INTEGER,
  channel TEXT NOT NULL,
  responded INTEGER DEFAULT 0,
  responded_at TEXT,
  FOREIGN KEY (alert_id) REFERENCES alerts(id),
  FOREIGN KEY (volunteer_id) REFERENCES volunteers(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS offline_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  operation TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  status TEXT DEFAULT 'queued',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  synced_at TEXT
);

CREATE TABLE IF NOT EXISTS watchdog_status (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agency TEXT NOT NULL,
  source TEXT DEFAULT 'api',
  heartbeat_at TEXT DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'online'
);

CREATE TABLE IF NOT EXISTS macro_updates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT NOT NULL,
  pinned INTEGER DEFAULT 0,
  lat REAL,
  lng REAL,
  created_by INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS rainfall_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  location TEXT NOT NULL,
  mm REAL NOT NULL,
  recorded_at TEXT DEFAULT CURRENT_TIMESTAMP
);
