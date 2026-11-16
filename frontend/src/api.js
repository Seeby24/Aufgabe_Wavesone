async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || `Request failed with status ${res.status}`);
  }
  return data;
}

export function listTasks() {
  return request('/tasks');
}

export function createTask(task) {
  return request('/tasks', { method: 'POST', body: JSON.stringify(task) });
}

export function updateTask(id, changes) {
  return request(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(changes) });
}

export function deleteTask(id) {
  return request(`/tasks/${id}`, { method: 'DELETE' });
}
