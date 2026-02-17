const express = require('express');
const router = express.Router();

const {
  createSalesAgent,
  getAllSalesAgents,
  deleteSalesAgent
} = require('../controllers/salesAgent.controller');

router.post('/agents', createSalesAgent);
router.get('/agents', getAllSalesAgents);
router.delete('/agents/:id', deleteSalesAgent);

module.exports = router;
