import { useCallback, useEffect, useState } from 'react';
import * as api from './api';
import TaskForm from './components/TaskForm.jsx';
import TaskList from './components/TaskList.jsx';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.listTasks();
      setTasks(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function handleCreate(task) {
    try {
      await api.createTask(task);
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggle(task) {
    try {
      const updated = await api.updateTask(task.id, {
        status: task.status === 'done' ? 'open' : 'done',
      });
      setTasks((current) => current.map((t) => (t.id === updated.id ? updated : t)));
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
      {/* TODO: filter and sort controls */}
      {error && <p className="error">⚠ {error}</p>}
      {loading ? <p>Loading…</p> : <TaskList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} />}
    </main>
  );
}
