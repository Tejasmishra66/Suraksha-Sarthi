const taskBoardService = require("../services/taskBoardService");
const filterByOffice = require("../utils/officeFilter");

function listTasks(req, res) {
  // Returns task board cards grouped client-side by status.
  const tasks = taskBoardService.listTasks();
  return res.json(filterByOffice(tasks, req.user));
}

function createTask(req, res) {
  const result = taskBoardService.createTask({
    incidentId: req.body.incidentId,
    title: req.body.title,
    details: req.body.details,
    assignedAgency: req.body.assignedAgency,
    notificationAgencies: req.body.notificationAgencies,
    status: req.body.status,
    createdBy: req.user.id,
    officeTags: req.body.officeTags
  });
  return res.status(201).json({
    id: result.lastInsertRowid,
    notifiedAgencies: result.notifiedAgencies,
    notifiedRecipients: result.notifiedRecipients
  });
}

function updateTask(req, res) {
  const result = taskBoardService.updateTask({
    taskId: Number(req.params.id),
    assignedAgency: req.body.assignedAgency,
    status: req.body.status,
    offline: Boolean(req.body.offline)
  });
  return res.json(result);
}

module.exports = {
  listTasks,
  createTask,
  updateTask
};
