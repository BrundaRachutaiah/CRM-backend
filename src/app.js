const express = require('express');
const app = express();

const errorHandler = require('./middleware/error.middleware');

// Middleware
app.use(express.json());

// Routes
app.use('/api/leads', require('./routes/lead.routes'));
app.use('/api', require('./routes/comment.routes'));
app.use('/api', require('./routes/tag.routes'));
app.use('/api', require('./routes/salesAgent.routes'));
app.use('/api', require('./routes/report.routes'));

// Global error handler
app.use(errorHandler);

module.exports = app;
