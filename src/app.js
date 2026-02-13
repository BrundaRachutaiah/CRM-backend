const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const errorHandler = require('./middleware/error.middleware');

/* =======================
   MIDDLEWARE
======================= */

// ✅ CORS — REQUIRED for local frontend → deployed backend
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000'
  ],
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
