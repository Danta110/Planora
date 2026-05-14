import { all, get, run } from '../config/database.js';

export function getAllTasks() {
  return all('SELECT * FROM tasks ORDER BY datetime(created_at) DESC, id DESC');
}

export function findTaskById(id) {
  return get('SELECT * FROM tasks WHERE id = ?', [id]);
}

export async function createTask({ title, description, status }) {
  const result = await run(
    'INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)',
    [title, description, status]
  );

  return findTaskById(result.id);
}

export async function updateTaskById(id, { title, description, status }) {
  await run(
    'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?',
    [title, description, status, id]
  );

  return findTaskById(id);
}

export function deleteTaskById(id) {
  return run('DELETE FROM tasks WHERE id = ?', [id]);
}

