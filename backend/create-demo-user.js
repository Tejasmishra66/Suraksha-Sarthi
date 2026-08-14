/**
 * create-demo-user.js
 * Run: node create-demo-user.js
 * Creates a demo public/citizen user account directly in the SQLite DB.
 */

const path    = require('path');
const bcrypt  = require('bcryptjs');

// Load env so we get the correct DB path
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const dbPath = path.resolve(process.cwd(), process.env.DB_PATH || './data/sdrf.db');
console.log('Using database:', dbPath);

const Database = require('better-sqlite3');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// ── Demo Account Details ──────────────────────────────────────────
const DEMO = {
  name:     'Demo User',
  email:    'demo@suraksha.gov.in',
  phone:    '+919876543210',
  password: 'Demo@1234',
  role:     'user',
};

// Hash password
const hash = bcrypt.hashSync(DEMO.password, 10);

// Check if already exists
const existing = db.prepare('SELECT id, email FROM users WHERE email = ?').get(DEMO.email);
if (existing) {
  console.log(`\n⚠️  Demo user already exists! (id=${existing.id})`);
} else {
  const result = db
    .prepare(
      'INSERT INTO users (name, email, password_hash, role, phone) VALUES (?, ?, ?, ?, ?)'
    )
    .run(DEMO.name, DEMO.email, hash, DEMO.role, DEMO.phone);
  console.log(`\n✅ Demo user created! (id=${result.lastInsertRowid})`);
}

console.log('\n────────────────────────────────────────');
console.log('  📱 DEMO ACCOUNT CREDENTIALS');
console.log('────────────────────────────────────────');
console.log(`  Email    : ${DEMO.email}`);
console.log(`  Password : ${DEMO.password}`);
console.log(`  Role     : ${DEMO.role}  (Citizen / Volunteer)`);
console.log(`  Phone    : ${DEMO.phone}`);
console.log('────────────────────────────────────────\n');

db.close();
