const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'data', 'sdrf.db');
const db = new Database(dbPath);

function migrateTasks() {
  const cols = db.prepare(`PRAGMA table_info('tasks')`).all();
  const names = cols.map((col) => col.name);
  const fkList = db.prepare(`PRAGMA foreign_key_list('tasks')`).all();
  const foreignKeyOk = fkList.some((row) => row.table === 'incidents');

  if (names.includes('incident_id') && foreignKeyOk) {
    console.log('tasks table already migrated');
    return;
  }

  const copyColumns = ['id', 'incident_id', 'title', 'details', 'assigned_agency', 'status', 'created_by', 'created_at'];

  db.pragma('foreign_keys = OFF');
  const migrate = db.transaction(() => {
    db.exec('ALTER TABLE tasks RENAME TO tasks_old');
    db.exec(`
      CREATE TABLE tasks (
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
      )
    `);
    db.exec(`INSERT INTO tasks (${copyColumns.join(', ')}) SELECT ${copyColumns.join(', ')} FROM tasks_old`);
    db.exec('DROP TABLE tasks_old');
  });

  migrate();
  db.pragma('foreign_keys = ON');
  console.log('tasks migration complete');
}

migrateTasks();
