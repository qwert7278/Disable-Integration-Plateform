import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize SQLite Database
const db = new Database('submissions.db');
db.pragma('journal_mode = WAL');

// Create table for submissions if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    duration_ms INTEGER,
    is_valid BOOLEAN,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    data TEXT
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json({ limit: '10mb' }));

  // --- API Routes ---

  // Simple Admin Auth
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
  const ADMIN_TOKEN = 'secret-admin-token-xyz';

  app.post('/api/auth/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      res.json({ success: true, token: ADMIN_TOKEN });
    } else {
      res.status(401).json({ success: false, error: 'Invalid password' });
    }
  });

  // 1. Submit a new form evaluation
  app.post('/api/submissions', (req, res) => {
    try {
      const { durationMs, data } = req.body;
      
      // Validation rule: Form must take at least 15 seconds (15000 ms) to be considered valid
      // This prevents spam/bot submissions that happen instantly.
      const isValid = durationMs >= 15000 ? 1 : 0;

      const stmt = db.prepare('INSERT INTO submissions (duration_ms, is_valid, data) VALUES (?, ?, ?)');
      stmt.run(durationMs, isValid, JSON.stringify(data));

      res.json({ success: true, isValid: !!isValid });
    } catch (error) {
      console.error('Error saving submission:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  // 2. Get statistics for the dashboard (Protected)
  app.get('/api/stats', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    try {
      const totalResult = db.prepare('SELECT COUNT(*) as count FROM submissions').get() as { count: number };
      const validResult = db.prepare('SELECT COUNT(*) as count FROM submissions WHERE is_valid = 1').get() as { count: number };
      const invalidResult = db.prepare('SELECT COUNT(*) as count FROM submissions WHERE is_valid = 0').get() as { count: number };
      
      const recentSubmissions = db.prepare(`
        SELECT id, duration_ms, is_valid, created_at 
        FROM submissions 
        ORDER BY created_at DESC 
        LIMIT 10
      `).all();

      res.json({
        total: totalResult.count,
        valid: validResult.count,
        invalid: invalidResult.count,
        recent: recentSubmissions
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  // --- Vite Middleware for Development ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    app.use(express.static(path.join(__dirname, 'dist')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
