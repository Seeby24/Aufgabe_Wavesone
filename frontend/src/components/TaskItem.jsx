import { formatDate, todayString } from "../date";

export default function TaskItem({ task, onToggle, onDelete }) {
  const done = task.status === "done";
  const overdue =
    !done && task.dueDate && new Date(task.dueDate) < todayString();

  return (
    <li className={`task ${done ? "done" : ""}`}>
      <input
        type="checkbox"
        checked={done}
        onChange={() => onToggle(task)}
        aria-label={`Mark "${task.title}" as ${done ? "open" : "done"}`}
      />
      <div className="task-body">
        <strong>{task.title}</strong>
        {task.description && <p>{task.description}</p>}
      </div>
      <span className={`priority p${task.priority}`} title="Priority">
        P{task.priority}
      </span>
      <span className={`due ${overdue ? "overdue" : ""}`}>
        {task.dueDate ? formatDate(task.dueDate) : "—"}
      </span>
      <button
        type="button"
        className="danger"
        onClick={() => onDelete(task)}
        aria-label={`Delete "${task.title}"`}
      >
        ✕
      </button>
    </li>
  );
}
