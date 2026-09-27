const Database = require("better-sqlite3");

const db = new Database("codevault.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS labs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        experiment_no INTEGER NOT NULL,
        title TEXT NOT NULL,
        subject TEXT NOT NULL,
        aim TEXT NOT NULL,
        theory TEXT,
        code TEXT,
        output TEXT,
        completed INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

module.exports = db;