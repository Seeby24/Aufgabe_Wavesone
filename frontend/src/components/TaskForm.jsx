import { useState } from 'react';
import { startOfDay } from '../date';

const EMPTY = { title: '', description: '', priority: '5', dueDate: '' };

export default function TaskForm({ onCreate }) {
  const [form, setForm] = useState(EMPTY);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;

    await onCreate({
      title: form.title.trim(),
      description: form.description,
      priority: form.priority,
      dueDate: form.dueDate || null,
    });
    setForm(EMPTY);
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input placeholder="Title" value={form.title} onChange={set('title')} required maxLength={200} />
      <input placeholder="Description" value={form.description} onChange={set('description')} maxLength={2000} />
      <label>
        Priority
        <select value={form.priority} onChange={set('priority')}>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>
      <label>
        Due
        <input type="date" value={form.dueDate} onChange={set('dueDate')} />
      </label>
      <button type="submit">Add task</button>
    </form>
  );
}
