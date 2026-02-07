const Tag = require('../models/Tag.model');

// POST /tags
exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if tag already exists
    const existingTag = await Tag.findOne({ name });
    if (existingTag) {
      return res.status(400).json({
        success: false,
        message: 'Tag already exists'
      });
    }

    const tag = new Tag({ name });
    await tag.save();

    res.status(201).json({
      success: true,
      message: 'Tag created successfully',
      data: tag
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// GET /tags
exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tags.length,
      data: tags
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
