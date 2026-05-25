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
      "INSERT INTO users (name, email, password_hash, role, agency) VALUES (?, ?, ?, ?, ?)"
    );
    insert.run("SDRF Officer", "officer@sdrf.local", passwordHash, "officer", "SDRF");
    insert.run("Police Head", "police@sdrf.local", passwordHash, "agency_head", "Police");
    insert.run("Medical Head", "medical@sdrf.local", passwordHash, "agency_head", "Medical");
    insert.run("Power Grid Head", "utility@sdrf.local", passwordHash, "agency_head", "Utility");
  }

  if (!hasRows("volunteers")) {
    const insert = db.prepare(
      "INSERT INTO volunteers (name, phone, lat, lng, capabilities, terrain_restrictions, active) VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    insert.run("Asha Verma", "+911111111111", 28.6139, 77.209, "SAR,FMR", "none", 1);
    insert.run("Kabir Singh", "+912222222222", 28.6239, 77.219, "Medical", "mountain", 1);
    insert.run("Naina Rao", "+913333333333", 28.5939, 77.189, "Debris,Utility", "flooded", 1);
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
      "INSERT INTO tasks (incident_id, title, details, assigned_agency, status, created_by) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(incidentId, "Deploy rescue boats", "Cover sectors 9A-9C", "SDRF", "New", 1);
    db.prepare(
      "INSERT INTO tasks (incident_id, title, details, assigned_agency, status, created_by) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(incidentId, "Set up medical camp", "Primary school building", "Medical", "In Progress", 1);
  }

  if (!hasRows("rainfall_logs")) {
    db.prepare("INSERT INTO rainfall_logs (location, mm) VALUES (?, ?)").run("Sector 9", 112.5);
    db.prepare("INSERT INTO rainfall_logs (location, mm) VALUES (?, ?)").run("Sector 12", 86.2);
  }
}

module.exports = {
  runSeed
};
