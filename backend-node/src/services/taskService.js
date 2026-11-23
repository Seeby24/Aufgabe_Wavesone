const Task = require("../models/task");
const { HttpError } = require("../errors");
const { default: mongoose } = require("mongoose");

const STATUSES = ["open", "done"];
const SORT_FIELDS = ["priority", "dueDate", "createdAt"];
const ORDERS = ["asc", "desc"];

// ---------- mapping ----------

function toDto(doc) {
  return {
    id: String(doc._id),
    title: doc.title,
    description: doc.description ?? "",
    priority: doc.priority,
    dueDate: doc.dueDate ?? null,
    status: doc.status,
    createdAt: doc.createdAt,
  };
}

// ---------- validation ----------

/**
 * Validates a create/update payload and returns the fields to store.
 * partial = true for PATCH (all fields optional).
 */
function validateTaskInput(body, { partial }) {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "Request body must be a JSON object");
  }

  const data = {};

  if (body.title !== undefined || !partial) {
    if (typeof body.title !== "string" || body.title.trim() === "") {
      throw new HttpError(400, "title is required and must not be blank");
    }
    if (body.title.trim().length > 200) {
      throw new HttpError(400, "title must be at most 200 characters");
    }
    data.title = body.title.trim();
  }

  if (body.description !== undefined) {
    if (
      typeof body.description !== "string" ||
      body.description.length > 2000
    ) {
      throw new HttpError(
        400,
        "description must be a string with at most 2000 characters",
      );
    }
    data.description = body.description;
  }

  if (body.priority !== undefined) {
    const priority = body.priority;

    if (
      typeof priority !== "number" ||
      !Number.isInteger(priority) ||
      priority < 1 ||
      priority > 10
    ) {
      throw new HttpError(400, "Priority must be an integer between 1 and 10");
    }

    data.priority = priority;
  }

  // dueDate is optional - normalise "no due date" to null

  if (body.dueDate !== undefined) {
    const dueDate = body.dueDate;

    if (
      dueDate !== null &&
      (typeof dueDate !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(dueDate) ||
        Number.isNaN(Date.parse(`${dueDate}T00:00:00Z`)) ||
        new Date(`${dueDate}T00:00:00Z`).toISOString().slice(0, 10) !== dueDate)
    ) {
      throw new HttpError(
        400,
        "dueDate must be a valid date in YYYY-MM-DD format or null",
      );
    }

    data.dueDate = dueDate;
  }

  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status)) {
      throw new HttpError(400, "status must be 'open' or 'done'");
    }
    data.status = body.status;
  }

  return data;
}

function validateTaskQuery(query) {
  const { status, minPriority, sort = "priority", order = "desc" } = query;

  if (status !== undefined && !STATUSES.includes(status)) {
    throw new HttpError(400, "status must be 'open' or 'done'");
  }

  let priority;
  if (minPriority !== undefined) {
    priority = Number(minPriority);
    if (!/^\d+$/.test(minPriority) || priority < 1 || priority > 10) {
      throw new HttpError(
        400,
        "minPriority must be an integer between 1 and 10",
      );
    }
  }

  if (!SORT_FIELDS.includes(sort)) {
    throw new HttpError(400, `sort must be one of: ${SORT_FIELDS.join(", ")}`);
  }

  if (!ORDERS.includes(order)) {
    throw new HttpError(400, "order must be 'asc' or 'desc'");
  }

  return { status, minPriority: priority, sort, order };
}

// ---------- service functions ----------

async function listTasks(query) {
  const { status, minPriority, sort, order } = validateTaskQuery(query);
  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (minPriority !== undefined) {
    filter.priority = { $gte: minPriority };
  }

  // Build database sorting
  const sortQuery = {
    [sort]: order === "asc" ? 1 : -1,
    _id: 1,
  };

  const docs = await Task.find(filter).sort(sortQuery).lean();

  return docs.map(toDto);
}

async function getTask(id) {
  if (!mongoose.isValidObjectId(id))
    throw new HttpError(400, "Invalid task ID");
  const doc = await Task.findById(id).lean();
  if (!doc) throw new HttpError(404, "Task not found");
  return toDto(doc);
}

async function createTask(body) {
  const data = validateTaskInput(body, { partial: false });
  const doc = await Task.create(data);
  return toDto(doc);
}

async function updateTask(id, body) {
  if (!mongoose.isValidObjectId(id))
    throw new HttpError(400, "Invalid task ID");
  const data = validateTaskInput(body, { partial: true });
  const doc = await Task.findByIdAndUpdate(id, data, { new: true }).lean();
  if (!doc) throw new HttpError(404, "Task not found");
  return toDto(doc);
}

async function deleteTask(id) {
  if (!mongoose.isValidObjectId(id))
    throw new HttpError(400, "Invalid task ID");
  const doc = await Task.findByIdAndDelete(id).lean();
  if (!doc) throw new HttpError(404, "Task not found");
}

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask };
