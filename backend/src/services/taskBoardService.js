const { TASK_STATUSES } = require("../constants/taskStatus");
const taskModel = require("../models/taskModel");
const { queueOperation } = require("./syncService");
const { db } = require("../db/database");
const { sendSms } = require("./smsService");

async function () {
  const list = Array.isArray(agencies) ? agencies : [];
  const normalized = list
    .map((agency) => String(agency || "").trim())
    .filter(Boolean);
  const deduped = [...new Set(normalized)];
  if (deduped.length > 0) {
    return deduped;
  }
  return fallbackAgency ? [String(fallbackAgency).trim()].filter(Boolean) : [];
}

async function () {
  if (!agencies.length) {
    return [];
  }

  const placeholders = agencies.map(() => "?").join(", ");
  return db
    .prepare(
      `SELECT id, name, agency, phone
       FROM users
       WHERE role = 'agency_head'
         AND agency IN (${placeholders})`
    )
    .all(...agencies);
}

async function () {
  return await );
}

async function () {
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

  const agenciesToNotify = normalizeAgencyList(notificationAgencies, assignedAgency);
  const result = await {
    incidentId,
    title,
    details,
    assignedAgency,
    notificationAgencies: agenciesToNotify,
    status,
    createdBy,
    officeTags
  });

  const agencyHeads = getAgencyHeadsByAgencies(agenciesToNotify);
  agencyHeads.forEach((head) => {
    sendSms(
      head.phone,
      `Task assigned: ${title}. ${details ? details + " " : ""}Please review in the SDRF dashboard.`
    );
  });

  return {
    ...result,
    notifiedAgencies: agenciesToNotify,
    notifiedRecipients: agencyHeads.map((head) => ({ id: head.id, agency: head.agency }))
  };
}

async function () {
  // Updates status/agency and optionally writes to offline queue mirror.
  const task = await taskId);
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
  await taskId, { assignedAgency: nextAgency, status: nextStatus });

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
