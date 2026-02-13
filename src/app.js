const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const errorHandler = require('./middleware/error.middleware');

const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:3000'
];
const envOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);
const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

/* =======================
   MIDDLEWARE
======================= */

// ✅ CORS — REQUIRED for local frontend → deployed backend
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

/* =======================
   ROUTES
======================= */

app.use('/api/leads', require('./routes/lead.routes'));
app.use('/api', require('./routes/comment.routes'));
app.use('/api', require('./routes/tag.routes'));
app.use('/api', require('./routes/salesAgent.routes'));
app.use('/api', require('./routes/report.routes'));

/* =======================
   ERROR HANDLER
======================= */

app.use(errorHandler);

module.exports = app;
