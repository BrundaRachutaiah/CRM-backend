const express = require('express');
const router = express.Router();

const {
  getLastWeekReport,
  getPipelineReport,
  getClosedByAgentReport
} = require('../controllers/report.controller');

router.get('/report/last-week', getLastWeekReport);
router.get('/report/pipeline', getPipelineReport);
router.get('/report/closed-by-agent', getClosedByAgentReport);

module.exports = router;
