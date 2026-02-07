const mongoose = require('mongoose');

// Lead Schema
const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true
    },

    source: {
      type: String,
      required: [true, 'Lead source is required'],
      enum: ['Website', 'Referral', 'Cold Call', 'Advertisement', 'Email', 'Other']
    },

    salesAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SalesAgent',
      required: [true, 'Sales Agent is required']
    },

    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed'],
      default: 'New'
    },

    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium'
    },

    timeToClose: {
      type: Number,
      required: [true, 'Time to Close is required'],
      min: [1, 'Time to Close must be a positive number']
    },

    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
      }
    ],

    closedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

/**
 * Automatically set closedAt when lead is closed
 * IMPORTANT:
 * - Do NOT use `next()` in modern Mongoose
 * - Synchronous pre hooks must NOT accept `next`
 */
leadSchema.pre('save', function () {
  if (this.status === 'Closed' && !this.closedAt) {
    this.closedAt = new Date();
  }
});

module.exports = mongoose.model('Lead', leadSchema);