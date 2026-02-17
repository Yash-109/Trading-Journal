// Reflection model schema
// Fields: userId, date, content, mood, lessons, etc.

import mongoose from 'mongoose';

const reflectionSchema = new mongoose.Schema(
  {
    // Reference to user who owns this reflection
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    // Reflection date
    date: {
      type: String,
      required: [true, 'Date is required']
    },
    // What went well today
    whatWentWell: {
      type: String,
      trim: true,
      default: ''
    },
    // Mistakes and rule violations
    mistakes: {
      type: String,
      trim: true,
      default: ''
    },
    // Improvements for tomorrow
    improvement: {
      type: String,
      trim: true,
      default: ''
    },
    // Mood/sentiment
    mood: {
      type: String,
      trim: true,
      default: 'neutral'
    },
    // Emotional balance score (1-10)
    emotionalBalance: {
      type: Number,
      min: 1,
      max: 10,
      default: 5
    }
  },
  {
    timestamps: true
  }
);

// Compound index to ensure one reflection per user per date
reflectionSchema.index({ userId: 1, date: 1 }, { unique: true });

const Reflection = mongoose.model('Reflection', reflectionSchema);

export default Reflection;
