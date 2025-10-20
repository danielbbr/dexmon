import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// use environment variable for database path, fallback to local path
const dbPath = process.env.DB_PATH || path.join(__dirname, '../../botimon.db');

// ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS known_devices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mac_address TEXT UNIQUE NOT NULL,
    name TEXT,
    icon TEXT DEFAULT 'default',
    vendor TEXT DEFAULT 'Unknown',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;