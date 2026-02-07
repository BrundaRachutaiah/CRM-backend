const express = require('express');
const router = express.Router();

const {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead
} = require('../controllers/lead.controller');

// Create lead
router.post('/', createLead);

// Fetch leads (with filters)
router.get('/', getAllLeads);

// Fetch single lead
router.get('/:id', getLeadById);

// Update lead (PATCH)
router.patch('/:id', updateLead);

// Delete lead
router.delete('/:id', deleteLead);

module.exports = router;
