const Comment = require('../models/Comment.model');
const Lead = require('../models/Lead.model');

/**
 * POST /leads/:id/comments
 * Add a comment to a lead
 */
exports.addCommentToLead = async (req, res) => {
  try {
    const leadId = req.params.id;
    const { commentText } = req.body;

    // Validation
    if (!commentText || typeof commentText !== 'string') {
      return res.status(400).json({
        error: 'commentText is required and must be a string.'
      });
    }

    // Check lead existence
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({
        error: `Lead with ID '${leadId}' not found.`
      });
    }

    /**
     * NOTE:
     * In real apps, author comes from auth middleware.
     * Here we assume salesAgentId is available in req.user
     */
    const salesAgentId = req.user?.id || lead.salesAgent;

    const comment = await Comment.create({
      lead: leadId,
      author: salesAgentId,
      commentText
    });

    const populatedComment = await comment.populate('author', 'name');

    res.status(201).json({
      id: populatedComment._id,
      commentText: populatedComment.commentText,
      author: populatedComment.author.name,
      createdAt: populatedComment.createdAt
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

/**
 * GET /leads/:id/comments
 * Fetch all comments for a lead
 */
exports.getCommentsByLead = async (req, res) => {
  try {
    const leadId = req.params.id;

    // Check lead existence
    const leadExists = await Lead.exists({ _id: leadId });
    if (!leadExists) {
      return res.status(404).json({
        error: `Lead with ID '${leadId}' not found.`
      });
    }

    const comments = await Comment.find({ lead: leadId })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    const response = comments.map(comment => ({
      id: comment._id,
      commentText: comment.commentText,
      author: comment.author.name,
      createdAt: comment.createdAt
    }));

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};
