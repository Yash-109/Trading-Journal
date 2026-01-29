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
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now
    },
    // Reflection content
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true
    },
    // Mood/sentiment
    mood: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Reflection = mongoose.model('Reflection', reflectionSchema);

export default Reflection;
