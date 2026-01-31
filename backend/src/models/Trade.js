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
    // === INDIAN MARKET FIELDS ===
    // Stock/Index symbol (e.g., 'NIFTY', 'BANKNIFTY', 'RELIANCE')
    symbol: {
      type: String,
      trim: true
    },
    // Quantity of shares/contracts
    quantity: {
      type: Number
    },
    // Trading charges (brokerage, taxes, etc.)
    charges: {
      type: Number
    },
    // Option type (CE - Call, PE - Put) for F&O trades
    optionType: {
      type: String,
      enum: ['CE', 'PE']
    },
    // Strike price for F&O options
    strikePrice: {
      type: Number
    },
    // Expiry date for F&O contracts
    expiryDate: {
      type: Date
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

// Validation for Indian market trades
tradeSchema.pre('save', function(next) {
  // Only validate if market is INDIAN
  if (this.market === 'INDIAN') {
    // instrumentType is required for INDIAN market
    if (!this.instrumentType) {
      return next(new Error('instrumentType is required for INDIAN market trades'));
    }
    
    // symbol is required for INDIAN market
    if (!this.symbol) {
      return next(new Error('symbol is required for INDIAN market trades'));
    }
    
    // F&O specific validation
    if (this.instrumentType === 'FNO') {
      if (!this.optionType) {
        return next(new Error('optionType (CE/PE) is required for F&O trades'));
      }
      if (!this.strikePrice) {
        return next(new Error('strikePrice is required for F&O trades'));
      }
      if (!this.expiryDate) {
        return next(new Error('expiryDate is required for F&O trades'));
      }
    }
  }
  next();
});

// Validation for updates
tradeSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  const updateDoc = update.$set || update;
  
  // Only validate if market is being set to INDIAN or already is INDIAN
  if (updateDoc.market === 'INDIAN') {
    // instrumentType is required for INDIAN market
    if (!updateDoc.instrumentType) {
      return next(new Error('instrumentType is required for INDIAN market trades'));
    }
    
    // symbol is required for INDIAN market
    if (!updateDoc.symbol) {
      return next(new Error('symbol is required for INDIAN market trades'));
    }
    
    // F&O specific validation
    if (updateDoc.instrumentType === 'FNO') {
      if (!updateDoc.optionType) {
        return next(new Error('optionType (CE/PE) is required for F&O trades'));
      }
      if (!updateDoc.strikePrice && updateDoc.strikePrice !== 0) {
        return next(new Error('strikePrice is required for F&O trades'));
      }
      if (!updateDoc.expiryDate) {
        return next(new Error('expiryDate is required for F&O trades'));
      }
    }
  }
  next();
});

const Trade = mongoose.model('Trade', tradeSchema);

export default Trade;
