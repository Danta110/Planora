import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databasePath = path.join(__dirname, '../../database.db');

export const db = new Database(databasePath);

export function run(sql, params = []) {
  const stmt = db.prepare(sql);
  const result = stmt.run(params);

  return {
    id: result.lastInsertRowid,
    changes: result.changes
  };
}

export function get(sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.get(params);
}

export function all(sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.all(params);
}

export function initializeDatabase() {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  console.log('Database initialized successfully');
}