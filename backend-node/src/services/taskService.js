const Task = require("../models/task");
const { HttpError } = require("../errors");
const { default: mongoose } = require("mongoose");

const STATUSES = ["open", "done"];

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
    data.priority = body.priority;
  }

  // dueDate is optional - normalise "no due date" to null

  if (body.dueDate !== undefined || !partial) {
    const dueDate = body.dueDate || null;
    if (dueDate !== null) {
      if (
        typeof dueDate !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(dueDate) ||
        Number.isNaN(Date.parse(`${dueDate}T00:00:00Z`)) ||
        new Date(`${dueDate}T00:00:00Z`).toISOString().slice(0, 10) !== dueDate
      ) {
        throw new HttpError(
          400,
          "dueDate must be a valid date in YYYY-MM-DD format",
        );
      }
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

// ---------- service functions ----------

async function listTasks() {
  // most important tasks first
  const docs = await Task.find().sort({ priority: 1, _id: 1 }).lean();
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
