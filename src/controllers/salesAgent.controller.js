const SalesAgent = require('../models/SalesAgent.model');

/**
 * POST /agents
 * Add a new sales agent
 */
exports.createSalesAgent = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Input validation
    if (!name || typeof name !== 'string') {
      return res.status(400).json({
        error: 'Name is required and must be a string.'
      });
    }

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        error: 'Email is required and must be a string.'
      });
    }

    // Check for duplicate email
    const existingAgent = await SalesAgent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({
        error: 'Sales agent with this email already exists.'
      });
    }

    const agent = await SalesAgent.create({ name, email });

    // Spec-aligned response
    res.status(201).json({
      id: agent._id,
      name: agent.name,
      email: agent.email,
      createdAt: agent.createdAt
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

/**
 * GET /agents
 * Fetch all sales agents
 */
exports.getAllSalesAgents = async (req, res) => {
  try {
    const agents = await SalesAgent.find().sort({ createdAt: -1 });

    // Spec-aligned response (array only)
    const response = agents.map(agent => ({
      id: agent._id,
      name: agent.name,
      email: agent.email,
      createdAt: agent.createdAt
    }));

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};
