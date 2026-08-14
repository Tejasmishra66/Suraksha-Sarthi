const { db } = require('./database');
const bcrypt = require('bcryptjs');

const hash = bcrypt.hashSync('password123', 10);
try {
  await db.prepare("INSERT INTO users (name, email, password_hash, role) VALUES ('Test Citizen', 'test@user.local', ?, 'user');").run(hash);
  console.log('Test public user created: test@user.local / password123');
} catch(e) {
  console.log("User might already exist.");
}
