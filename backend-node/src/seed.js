const path = require("path");
const fs = require("fs");
const Task = require("./models/task");

const SEED_FILE = path.resolve(__dirname, "..", "..", "seed", "tasks.json");

async function seedIfEmpty() {
  const count = await Task.estimatedDocumentCount();
  if (count > 0) return;

  const tasks = JSON.parse(fs.readFileSync(SEED_FILE, "utf8"));
  await Task.insertMany(tasks);
  console.log(`[seed] Inserted ${tasks.length} tasks`);
}

module.exports = { seedIfEmpty };
