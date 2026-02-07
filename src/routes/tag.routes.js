const express = require('express');
const router = express.Router();

const {
  createTag,
  getAllTags
} = require('../controllers/tag.controller');

// Add new tag
router.post('/tags', createTag);

// Get all tags
router.get('/tags', getAllTags);

module.exports = router;
