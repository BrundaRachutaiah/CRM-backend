const Lead = require('../models/Lead.model');
const SalesAgent = require('../models/SalesAgent.model');
const Tag = require('../models/Tag.model');

/**
 * POST /api/leads
 * Create a new lead
 */
exports.createLead = async (req, res, next) => {
  try {
    const { tags, ...leadData } = req.body;

    let tagIds = [];

    if (tags && tags.length > 0) {
      const tagDocs = await Tag.find({ name: { $in: tags } });
      tagIds = tagDocs.map(tag => tag._id);
    }

    const lead = new Lead({
      ...leadData,
      tags: tagIds
    });

    await lead.save();

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: lead
    });
  } catch (error) {
    next(error); // ✅ pass error to middleware
  }
};

/**
 * GET /api/leads
 * Fetch leads with filters
 */
exports.getAllLeads = async (req, res, next) => {
  try {
    const { salesAgent, status, source, tags } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (source) filter.source = source;

    // Filter by sales agent name
    if (salesAgent) {
      const agent = await SalesAgent.findOne({ name: salesAgent });
      if (!agent) {
        return res.status(200).json({
          success: true,
          count: 0,
          data: []
        });
      }
      filter.salesAgent = agent._id;
    }

    // Filter by tag names
    if (tags) {
      const tagNames = tags.split(',');
      const tagDocs = await Tag.find({ name: { $in: tagNames } });
      const tagIds = tagDocs.map(tag => tag._id);
      filter.tags = { $in: tagIds };
    }

    const leads = await Lead.find(filter)
      .populate('salesAgent', 'name email')
      .populate('tags', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/leads/:id
 * Fetch single lead
 */
exports.getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('salesAgent', 'name email')
      .populate('tags', 'name');

    if (!lead) {
      const err = new Error('Lead not found');
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/leads/:id
 * Update lead
 */
exports.updateLead = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    const existingLead = await Lead.findById(req.params.id);

    if (!existingLead) {
      const err = new Error('Lead not found');
      err.statusCode = 404;
      throw err;
    }

    if (updateData.status === 'Closed' && !existingLead.closedAt) {
      updateData.closedAt = new Date();
    }

    if (updateData.status && updateData.status !== 'Closed') {
      updateData.closedAt = null;
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/leads/:id
 * Delete lead
 */
exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      const err = new Error('Lead not found');
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
