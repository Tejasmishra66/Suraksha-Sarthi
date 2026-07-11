const { db } = require("../db/database");

function parseNotificationAgencies(rawValue) {
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return String(rawValue)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

function listTasks() {
  // Reads tasks with incident context for Kanban board.
  return db
    .prepare(
      `SELECT t.*, i.title AS incident_title, i.verification_state
       FROM tasks t
       JOIN incidents i ON i.id = t.incident_id
       ORDER BY t.created_at DESC`
    )
    .all()
    .map((row) => ({
      ...row,
      notification_agencies: parseNotificationAgencies(row.notification_agencies)
    }));
}

function getTaskById(taskId) {
  return db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId);
}

function createTask({ incidentId, title, details, assignedAgency, notificationAgencies, status, createdBy, officeTags }) {
  return db
    .prepare(
      "INSERT INTO tasks (incident_id, title, details, assigned_agency, notification_agencies, status, created_by, office_tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    )
    .run(incidentId, title, details || "", assignedAgency || null, JSON.stringify(notificationAgencies || []), status, createdBy, JSON.stringify(officeTags || []));
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
