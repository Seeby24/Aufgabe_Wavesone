const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, default: "", maxlength: 2000 },
    priority: { type: Number, default: 5 },
    dueDate: { type: String, default: null },
    status: { type: String, enum: ["open", "done"], default: "open" },
  },
  { timestamps: true },
);

module.exports = mongoose.models.Task || mongoose.model("Task", taskSchema);
