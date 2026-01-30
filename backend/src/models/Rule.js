// Rule model schema
// Fields: userId, title, description, category, status, etc.

import mongoose from 'mongoose';

const ruleSchema = new mongoose.Schema(
  {
    // Reference to user who owns this rule
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    // Rule title
    title: {
      type: String,
      required: [true, 'Rule title is required'],
      trim: true
    },
    // Rule description
    description: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Rule = mongoose.model('Rule', ruleSchema);

export default Rule;
