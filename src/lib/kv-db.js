import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'

// Database file location (must match the mounted volume)
const dbPath = path.resolve('kvstore.db')

// Ensure directory exists before opening the database
const dbDir = path.dirname(dbPath)
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

// Connect to SQLite database
const db = new Database(dbPath)
db.exec('CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT)')

const KVDB = {
  get(key) {
    const row = db.prepare('SELECT value FROM kv WHERE key = ?').get(key)
    return row ? JSON.parse(row.value) : null
  },

  getAll() {
    return db
      .prepare('SELECT key, value FROM kv')
      .all()
      .map((row) => ({
        key: row.key,
        value: JSON.parse(row.value),
      }))
  },

  addAll(entries) {
    if (Array.isArray(entries)) {
      for (const { key, value } of entries) {
        this.add(key, value)
      }
    } else if (entries && typeof entries === 'object') {
      for (const [key, value] of Object.entries(entries)) {
        this.add(key, value)
      }
    }
  },

  add(key, value) {
    db.prepare('INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)').run(
      key,
      JSON.stringify(value),
    )
  },

  delete(key) {
    db.prepare('DELETE FROM kv WHERE key = ?').run(key)
  },

  purge() {
    db.exec('DELETE FROM kv')
  },

  size() {
    return db.prepare('SELECT COUNT(*) AS count FROM kv').get().count
  },
}

export default KVDB
