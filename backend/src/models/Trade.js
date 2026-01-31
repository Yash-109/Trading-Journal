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
    // Trading pair (e.g., 'BTC/USD', 'EUR/USD', 'XAUUSD')
    pair: {
      type: String,
      required: [true, 'Trading pair is required'],
      trim: true
    },
    // Market type
    market: {
      type: String,
      enum: ['FOREX', 'CRYPTO', 'INDIAN'],
      default: 'FOREX'
    },
    // Instrument type (relevant for INDIAN market)
    instrumentType: {
      type: String,
      enum: ['INDEX', 'FNO'],
      required: false
    },
    // Trade direction (Buy or Sell)
    direction: {
      type: String,
      enum: ['Buy', 'Sell'],
      default: 'Buy'
    },
    // Entry price
    entry: {
      type: Number,
      required: [true, 'Entry price is required']
    },
    // Stop loss price
    stopLoss: {
      type: Number
    },
    // Take profit price
    takeProfit: {
      type: Number
    },
    // Exit price
    exit: {
      type: Number
    },
    // Lot size / quantity
    lotSize: {
      type: Number
    },
    // Profit/Loss amount
    pnl: {
      type: Number,
      default: 0
    },
    // Risk:Reward ratio
    rr: {
      type: Number,
      default: 0
    },
    // Trading session (London, New York, Asia, Sydney)
    session: {
      type: String,
      enum: ['London', 'New York', 'Asia', 'Sydney'],
      default: 'London'
    },
    // Trading strategy used
    strategy: {
      type: String,
      trim: true
    },
    // Whether trading rules were followed
    ruleFollowed: {
      type: Boolean,
      default: true
    },
    // Emotional state during trade
    emotion: {
      type: String,
      enum: ['Calm', 'Fear', 'Greed', 'Hesitant', 'Overconfident', 'Revenge'],
      default: 'Calm'
    },
    // Trade quality rating (1-10)
    tradeQuality: {
      type: Number,
      min: 1,
      max: 10,
      default: 5
    },
    // Screenshot URL or path
    screenshot: {
      type: String
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
