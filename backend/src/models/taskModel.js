const { db } = require("../db/database");

function listTasks() {
  // Reads tasks with incident context for Kanban board.
  return db
    .prepare(
      `SELECT t.*, i.title AS incident_title, i.verification_state
       FROM tasks t
       JOIN incidents i ON i.id = t.incident_id
       ORDER BY t.created_at DESC`
    )
    .all();
}

function getTaskById(taskId) {
  return db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId);
}

function createTask({ incidentId, title, details, assignedAgency, status, createdBy }) {
  return db
    .prepare(
      "INSERT INTO tasks (incident_id, title, details, assigned_agency, status, created_by) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(incidentId, title, details || "", assignedAgency || null, status, createdBy);
}

function updateTask(taskId, { assignedAgency, status }) {
  return db.prepare("UPDATE tasks SET assigned_agency = ?, status = ? WHERE id = ?").run(assignedAgency, status, taskId);
}

module.exports = {
  listTasks,
  getTaskById,
  createTask,
  updateTask
};
