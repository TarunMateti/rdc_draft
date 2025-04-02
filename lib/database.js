import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

// Convert `import.meta.url` to directory path
const __dirname = path.dirname(fileURLToPath(import.meta.url));


// Initialize SQLite Database
const db = new Database(path.join(process.cwd(), "database/database.db"));

// Ensure the table exists
db.exec(`
  CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT
  )
`);

export default db;
