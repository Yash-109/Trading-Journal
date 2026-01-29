// Trade model schema
// Fields: userId, pair, strategy, entry, exit, pnl, notes, etc.

import mongoose from 'mongoose';

const tradeSchema = new mongoose.Schema(
  {
    // Reference to user who owns this trade
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    // Trading pair (e.g., 'BTC/USD', 'EUR/USD')
    pair: {
      type: String,
      required: [true, 'Trading pair is required'],
      trim: true
    },
    // Trading strategy used
    strategy: {
      type: String,
      trim: true
    },
    // Entry price
    entry: {
      type: Number,
      required: [true, 'Entry price is required']
    },
    // Exit price
    exit: {
      type: Number
    },
    // Profit/Loss
    pnl: {
      type: Number
    },
    // Trade notes
    notes: {
      type: String,
      trim: true
    },
    // Trade date
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const Trade = mongoose.model('Trade', tradeSchema);

export default Trade;
