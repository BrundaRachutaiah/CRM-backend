const express = require('express');
const router = express.Router();

const {
  createSalesAgent,
  getAllSalesAgents
} = require('../controllers/salesAgent.controller');

router.post('/agents', createSalesAgent);
router.get('/agents', getAllSalesAgents);

module.exports = router;
