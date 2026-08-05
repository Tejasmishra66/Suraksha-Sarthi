const path = require("path");
const Database = require("better-sqlite3");

// The database path as configured in the backend
const dbPath = path.resolve(__dirname, "../data/sdrf.db");

console.log(`Connecting to database at ${dbPath}`);
const db = new Database(dbPath);

console.log("Cleaning up fake incidents, tasks, and volunteers...");

db.exec("DELETE FROM tasks;");
console.log("Deleted all tasks.");

db.exec("DELETE FROM incidents;");
console.log("Deleted all incidents.");

db.exec("DELETE FROM volunteers;");
console.log("Deleted all volunteers.");

db.close();
console.log("Cleanup complete.");
