const bcrypt = require("bcryptjs");
const { db } = require("./database");

function hasRows(tableName) {
  const row = db.prepare(`SELECT COUNT(*) AS count FROM ${tableName}`).get();
  return row.count > 0;
}

function runSeed() {
  // Seeds data once for dev startup if DB is empty.
  if (!hasRows("users")) {
    const passwordHash = bcrypt.hashSync("password123", 10);
    const insert = db.prepare(
      "INSERT INTO users (name, email, password_hash, role, agency, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    insert.run("SDRF Officer", "officer@sdrf.local", passwordHash, "officer", "SDRF", "+919000000000", "HQ, SDRF Campus");
    insert.run("Police Head", "police@sdrf.local", passwordHash, "agency_head", "Police", "+919000000001", "Police HQ");
    insert.run("Medical Head", "medical@sdrf.local", passwordHash, "agency_head", "Medical", "+919000000002", "Medical Directorate");
    insert.run("Power Grid Head", "utility@sdrf.local", passwordHash, "agency_head", "Utility", "+919000000003", "Power Grid Office");
  }

  if (!hasRows("volunteers")) {
    const insert = db.prepare(
      "INSERT INTO volunteers (name, phone, lat, lng, capabilities, terrain_restrictions, department, place, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    insert.run("Asha Verma", "+911111111111", 28.6139, 77.209, "SAR,FMR", "none", "SDRF", "Shimla", 1);
    insert.run("Kabir Singh", "+912222222222", 28.6239, 77.219, "Medical", "mountain", "Medical", "Manali", 1);
    insert.run("Naina Rao", "+913333333333", 28.5939, 77.189, "Debris,Utility", "flooded", "Utility", "Dharamshala", 1);
  }

  if (!hasRows("resources")) {
    const insert = db.prepare(
      "INSERT INTO resources (name, category, quantity, lat, lng, status) VALUES (?, ?, ?, ?, ?, ?)"
    );
    insert.run("Inflatable Boat", "Rescue", 8, 28.6139, 77.209, "available");
    insert.run("Medical Kit", "Medical", 60, 28.6239, 77.215, "available");
    insert.run("Portable Tower", "Connectivity", 3, 28.601, 77.198, "reserved");
  }

  if (!hasRows("incidents")) {
    const incidentResult = db
      .prepare(
        `INSERT INTO incidents
         (title, description, disaster_type, lat, lng, status, agency_assigned, verification_state)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        "Urban Flood Sector 9",
        "Water level rising near school and bus stop",
        "Flood",
        28.6125,
        77.204,
        "In Progress",
        "SDRF",
        "Unverified"
      );

    const incidentId = incidentResult.lastInsertRowid;
    db.prepare(
      "INSERT INTO tasks (incident_id, title, details, assigned_agency, notification_agencies, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(incidentId, "Deploy rescue boats", "Cover sectors 9A-9C", "SDRF", JSON.stringify(["SDRF", "Police"]), "New", 1);
    db.prepare(
      "INSERT INTO tasks (incident_id, title, details, assigned_agency, notification_agencies, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(incidentId, "Set up medical camp", "Primary school building", "Medical", JSON.stringify(["Medical"]), "In Progress", 1);
  }

  if (!hasRows("bulletins")) {
    const insert = db.prepare("INSERT INTO bulletins (category, message, author_id) VALUES (?, ?, ?)");
    insert.run("Connectivity", "Temporary satellite link active for field teams.", 1);
    insert.run("Utility Status", "Power restoration is ongoing in sector 12.", 1);
  }

  if (!hasRows("intel_pins")) {
    const insert = db.prepare("INSERT INTO intel_pins (lat, lon, department, note) VALUES (?, ?, ?, ?)");
    insert.run(28.6139, 77.209, "Police", "Checkpoint established near main junction.");
    insert.run(28.6239, 77.215, "Medical", "Mobile clinic parked beside school gate.");
  }

  if (!hasRows("heartbeats")) {
    const insert = db.prepare("INSERT INTO heartbeats (agency_id, user_id, location, last_seen, status) VALUES (?, ?, ?, ?, ?)");
    insert.run("SDRF", 1, "HQ command room", new Date().toISOString(), "ONLINE");
    insert.run("Police", 2, "Control room", new Date(Date.now() - 12 * 60 * 1000).toISOString(), "OFFLINE");
  }

  if (!hasRows("rainfall_logs")) {
    db.prepare("INSERT INTO rainfall_logs (location, mm) VALUES (?, ?)").run("Sector 9", 112.5);
    db.prepare("INSERT INTO rainfall_logs (location, mm) VALUES (?, ?)").run("Sector 12", 86.2);
  }

  if (!hasRows("equipment")) {
    const insert = db.prepare("INSERT INTO equipment (qr_code, name, category, status, lat, lng, current_owner_id) VALUES (?, ?, ?, ?, ?, ?, ?)");
    insert.run("EQ-1001", "Heavy Duty Chainsaw", "Tools", "available", 28.6139, 77.209, 1);
    insert.run("EQ-1002", "Satellite Phone", "Communication", "dispatched", 28.6239, 77.215, 2);
    insert.run("EQ-1003", "Thermal Drone", "Recon", "available", 28.601, 77.198, 1);
  }

  if (!hasRows("offline_guides")) {
    const insert = db.prepare("INSERT INTO offline_guides (title, content, download_url) VALUES (?, ?, ?)");
    insert.run(
      "Mountain Rescue Basics", 
      "Step 1: Check weather. Step 2: Ensure harnesses are secured. Step 3: Map the trail.",
      "/guides/mountain-rescue.pdf"
    );
    insert.run("Flood Evacuation SOP", "1. Sound local alarms. 2. Evacuate low-lying sectors. 3. Deploy rescue boats.", "/guides/flood-sop.pdf");
  }
}

module.exports = {
  runSeed
};
