import { useCallback, useEffect, useState } from "react";
import * as api from "./api";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("");
  const [minPriority, setMinPriority] = useState("");
  const [sort, setSort] = useState("priority");
  const [order, setOrder] = useState("desc");

  const loadTasks = useCallback(async () => {
    try {
      const data = await api.listTasks({ status, minPriority, sort, order });
      setTasks(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [status, minPriority, sort, order]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function handleCreate(task) {
    try {
      await api.createTask(task);
      await loadTasks();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  async function handleToggle(task) {
    try {
      await api.updateTask(task.id, {
        status: task.status === "done" ? "open" : "done",
      });
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(task) {
    try {
      await api.deleteTask(task.id);
      setTasks((current) => current.filter((t) => t.id !== task.id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="container">
      <h1>Task Tracker</h1>
      <TaskForm onCreate={handleCreate} />

      <div className="filters">
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="open">Open</option>
            <option value="done">Done</option>
          </select>
        </label>

        <label>
          Min. priority
          <select
            value={minPriority}
            onChange={(e) => setMinPriority(e.target.value)}
          >
            <option value="">All</option>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((p) => (
              <option key={p} value={p}>
                From {p}
              </option>
            ))}
          </select>
        </label>

        <label>
          Sort by
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="priority">Priority</option>
            <option value="dueDate">Due date</option>
            <option value="createdAt">Created</option>
          </select>
        </label>

        <label>
          Order
          <select value={order} onChange={(e) => setOrder(e.target.value)}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </label>
      </div>

      {error && <p className="error">⚠ {error}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <TaskList
          tasks={tasks}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      )}
    </main>
  );
}
