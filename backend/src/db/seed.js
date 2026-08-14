const bcrypt = require("bcryptjs");
const { db, runMigrations } = require("./database");

async function hasRows(tableName) {
  const row = await db.prepare(`SELECT COUNT(*) AS count FROM ${tableName}`).get();
  return row.count > 0;
}

async function await seedUsers() {
  if (await hasRows("users")) return;

  const passwordHash = bcrypt.hashSync("password123", 10);
  const insert = await db.prepare(
    "INSERT INTO users (name, email, password_hash, role, agency, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );

    await insert.run("SDRF Officer", "officer@sdrf.local", passwordHash, "admin", "SDRF", "+919000000000", "HQ, SDRF Campus");
  await insert.run("Police Head", "police@sdrf.local", passwordHash, "agency_head", "Police", "+919000000001", "Police HQ");
  await insert.run("Medical Head", "medical@sdrf.local", passwordHash, "agency_head", "Medical", "+919000000002", "Medical Directorate");
  await insert.run("Power Grid Head", "utility@sdrf.local", passwordHash, "agency_head", "Utility", "+919000000003", "Power Grid Office");
}

async function await seedVolunteers() {
  if (await hasRows("volunteers")) return;

  const volunteerInsert = db.prepare(
    "INSERT INTO volunteers (name, phone, lat, lng, capabilities, terrain_restrictions, department, place, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );
  // Real volunteers can be added later
}

async function await seedResources() {
  if (await hasRows("resources")) return;

  const insert = db.prepare(
    "INSERT INTO resources (name, category, quantity, lat, lng, status) VALUES (?, ?, ?, ?, ?, ?)"
  );

  await insert.run("Inflatable Boat", "Rescue", 8, 28.6139, 77.209, "available");
  await insert.run("Medical Kit", "Medical", 60, 28.6239, 77.215, "available");
  await insert.run("Portable Tower", "Connectivity", 3, 28.601, 77.198, "reserved");
}

async function await seedIncidentsAndTasks() {
  if (await hasRows("incidents")) return;

  const incidentInsert = db.prepare(
    `INSERT INTO incidents 
     (type, description, lat, lng, reported_by_user_id, status, district, tehsil, place) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  // Real incidents will be reported by users and fetched from HPSDMA
}

async function await seedBulletins() {
  if (await hasRows("bulletins")) return;

  const insert = db.prepare("INSERT INTO bulletins (category, message, author_id) VALUES (?, ?, ?)");
  await insert.run("Connectivity", "Temporary satellite link active for field teams.", 1);
  await insert.run("Utility Status", "Power restoration is ongoing in sector 12.", 1);
}

async function await seedIntelPins() {
  if (await hasRows("intel_pins")) return;

  const insert = db.prepare("INSERT INTO intel_pins (lat, lon, department, note) VALUES (?, ?, ?, ?)");
  await insert.run(28.6139, 77.209, "Police", "Checkpoint established near main junction.");
  await insert.run(28.6239, 77.215, "Medical", "Mobile clinic parked beside school gate.");
}

async function await seedHeartbeats() {
  if (await hasRows("heartbeats")) return;

  const insert = db.prepare("INSERT INTO heartbeats (agency_id, user_id, location, last_seen, status) VALUES (?, ?, ?, ?, ?)");
  await insert.run("SDRF", 1, "HQ command room", new Date().toISOString(), "ONLINE");
  await insert.run("Police", 2, "Control room", new Date(Date.now() - 12 * 60 * 1000).toISOString(), "OFFLINE");
}

async function await seedRainfall() {
  if (await hasRows("rainfall_logs")) return;
  db.prepare("INSERT INTO rainfall_logs (location, mm) VALUES (?, ?)").run("Sector 9", 112.5);
  await db.prepare("INSERT INTO rainfall_logs (location, mm) VALUES (?, ?)").run("Sector 12", 86.2);
}

async function await seedEquipment() {
  if (await hasRows("equipment")) return;
  const insert = db.prepare("INSERT INTO equipment (qr_code, name, category, status, lat, lng, current_owner_id) VALUES (?, ?, ?, ?, ?, ?, ?)");
  await insert.run("EQ-1001", "Heavy Duty Chainsaw", "Tools", "available", 28.6139, 77.209, 1);
  await insert.run("EQ-1002", "Satellite Phone", "Communication", "dispatched", 28.6239, 77.215, 2);
  await insert.run("EQ-1003", "Thermal Drone", "Recon", "available", 28.601, 77.198, 1);
}

async function await seedGuides() {
  if (await hasRows("offline_guides")) return;
  const insert = db.prepare("INSERT INTO offline_guides (title, content, download_url) VALUES (?, ?, ?)");
  await insert.run(
    "Mountain Rescue Basics", 
    "Step 1: Check weather. Step 2: Ensure harnesses are secured. Step 3: Map the trail.",
    "/guides/mountain-rescue.pdf"
  );
  await insert.run("Flood Evacuation SOP", "1. Sound local alarms. 2. Evacuate low-lying sectors. 3. Deploy rescue boats.", "/guides/flood-sop.pdf");
}

async function runSeed() {
  // Seeds demo records for volunteers/resources/incidents and task board.
  await runMigrations();
  await seedUsers();
  await seedVolunteers();
  await seedResources();
  await seedIncidentsAndTasks();
  await seedBulletins();
  await seedIntelPins();
  await seedHeartbeats();
  await seedRainfall();
  await seedEquipment();
  await seedGuides();
}

runSeed();
console.log("Database seeded successfully.");
