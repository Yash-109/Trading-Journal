// Trade controller
// Handlers: createTrade, getTrades, getTradeById, updateTrade, deleteTrade

import Trade from '../models/Trade.js';

/**
 * Create a new trade
 * POST /api/trades
 */
export const createTrade = async (req, res) => {
  try {
    const { pair, strategy, entry, exit, pnl, notes, date } = req.body;
    
    // Create trade with userId from auth middleware
    const trade = await Trade.create({
      userId: req.user.userId,
      pair,
      strategy,
      entry,
      exit,
      pnl,
      notes,
      date
    });
    
    res.status(201).json({
      status: 'success',
      data: trade
    });
  } catch (error) {
    console.error('Create trade error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get all trades for authenticated user
 * GET /api/trades
 */
export const getTrades = async (req, res) => {
  try {
    // Filter trades by userId from auth middleware
    const trades = await Trade.find({ userId: req.user.userId }).sort({ date: -1 });
    
    res.status(200).json({
      status: 'success',
      data: trades
    });
  } catch (error) {
    console.error('Get trades error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
