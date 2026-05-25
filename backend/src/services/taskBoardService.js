const { TASK_STATUSES } = require("../constants/taskStatus");
const taskModel = require("../models/taskModel");
const { queueOperation } = require("./syncService");

function listTasks() {
  return taskModel.listTasks();
}

function createTask({ incidentId, title, details, assignedAgency, status = "New", createdBy }) {
  // Validates and creates task cards for digital handshake workflow.
  if (!incidentId || !title) {
    const error = new Error("incidentId and title are required");
    error.statusCode = 400;
    throw error;
  }

  if (!TASK_STATUSES.includes(status)) {
    const error = new Error("Invalid task status");
    error.statusCode = 400;
    throw error;
  }

  return taskModel.createTask({ incidentId, title, details, assignedAgency, status, createdBy });
}

function updateTask({ taskId, assignedAgency, status, offline }) {
  // Updates status/agency and optionally writes to offline queue mirror.
  const task = taskModel.getTaskById(taskId);
  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  if (status && !TASK_STATUSES.includes(status)) {
    const error = new Error("Invalid task status");
    error.statusCode = 400;
    throw error;
  }

  const nextStatus = status || task.status;
  const nextAgency = assignedAgency || task.assigned_agency;
  taskModel.updateTask(taskId, { assignedAgency: nextAgency, status: nextStatus });

  if (offline) {
    queueOperation("task", String(taskId), "update_status", { taskId, status: nextStatus });
  }

  return { id: taskId, assignedAgency: nextAgency, status: nextStatus };
}

module.exports = {
  listTasks,
  createTask,
  updateTask
};
