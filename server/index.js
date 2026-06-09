const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Pre-register all Mongoose models so populate() always works regardless of route order
require('./models/User');
require('./models/Badge');
require('./models/Course');
require('./models/Progress');
require('./models/Challenge');
require('./models/Payment');

const app = express();

// ── CORS ─────────────────────────────────────────────────────────────────────
// macOS port 5000 is hijacked by AirPlay Receiver, so we run on PORT=8000.
// Explicitly allow both Vite dev-server ports so preflight never fails.
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175',
    'http://127.0.0.1:5176',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
};

app.use(cors(corsOptions));
// cors() middleware handles OPTIONS preflight automatically — no extra handler needed

// ── Body parser ───────────────────────────────────────────────────────────────
app.use(express.json());

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'CodeCamp API is running' });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/courses',       require('./routes/courses'));
app.use('/api/challenges',    require('./routes/challenges'));
app.use('/api/users',         require('./routes/users'));
app.use('/api/progress',      require('./routes/progress'));
app.use('/api/ai',            require('./routes/ai'));
app.use('/api/payment',       require('./routes/payment'));
app.use('/api/admin',         require('./routes/admin'));
app.use('/api/youtube',       require('./routes/youtube'));
app.use('/api/notifications', require('./routes/notifications'));

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`✅  Server running on http://localhost:${PORT}`);
});
