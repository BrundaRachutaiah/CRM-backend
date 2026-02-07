const Lead = require('../models/Lead.model');

/**
 * 1️⃣ GET /report/last-week
 * Fetch leads that were CLOSED in the last 7 days
 */
exports.getLastWeekReport = async (req, res) => {
  try {
    const lastWeekDate = new Date();
    lastWeekDate.setDate(lastWeekDate.getDate() - 7);

    const leads = await Lead.find({
      status: 'Closed',
      closedAt: { $gte: lastWeekDate }
    })
      .populate('salesAgent', 'name')
      .select('name salesAgent closedAt');

    const response = leads.map(lead => ({
      id: lead._id,
      name: lead.name,
      salesAgent: lead.salesAgent.name,
      closedAt: lead.closedAt
    }));

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * 2️⃣ GET /report/pipeline
 * Fetch total number of leads currently in pipeline
 * (All statuses except "Closed")
 */
exports.getPipelineReport = async (req, res) => {
  try {
    const totalLeadsInPipeline = await Lead.countDocuments({
      status: { $ne: 'Closed' }
    });

    res.status(200).json({
      totalLeadsInPipeline
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * 3️⃣ GET /report/closed-by-agent
 * Fetch number of closed leads grouped by sales agent
 */
exports.getClosedByAgentReport = async (req, res) => {
  try {
    const report = await Lead.aggregate([
      {
        $match: { status: 'Closed' }
      },
      {
        $group: {
          _id: '$salesAgent',
          closedLeads: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'salesagents',
          localField: '_id',
          foreignField: '_id',
          as: 'agent'
        }
      },
      {
        $unwind: '$agent'
      },
      {
        $project: {
          _id: 0,
          salesAgent: '$agent.name',
          email: '$agent.email',
          closedLeads: 1
        }
      }
    ]);

    res.status(200).json({
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
