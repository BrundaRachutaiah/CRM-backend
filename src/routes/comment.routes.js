const express = require('express');
const router = express.Router();

const {
  addCommentToLead,
  getCommentsByLead
} = require('../controllers/comment.controller');

router.post('/leads/:id/comments', addCommentToLead);
router.get('/leads/:id/comments', getCommentsByLead);

module.exports = router;
