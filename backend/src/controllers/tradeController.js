// Trade controller
// Handlers: createTrade, getTrades, getTradeById, updateTrade, deleteTrade

import Trade from '../models/Trade.js';

/**
 * Create a new trade
 * POST /api/trades
 */
export const createTrade = async (req, res) => {
  try {
    const { 
      pair, 
      market,
      instrumentType,
      direction,
      entry, 
      stopLoss,
      takeProfit,
      exit, 
      lotSize,
      pnl, 
      rr,
      session,
      strategy,
      ruleFollowed,
      emotion,
      tradeQuality,
      screenshot,
      notes, 
      date 
    } = req.body;
    
    // Create trade with userId from auth middleware
    const trade = await Trade.create({
      userId: req.user.userId,
      pair,
      market,
      instrumentType,
      direction,
      entry,
      stopLoss,
      takeProfit,
      exit,
      lotSize,
      pnl,
      rr,
      session,
      strategy,
      ruleFollowed,
      emotion,
      tradeQuality,
      screenshot,
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

/**
 * Get single trade by ID
 * GET /api/trades/:id
 */
export const getTradeById = async (req, res) => {
  try {
    const trade = await Trade.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!trade) {
      return res.status(404).json({
        status: 'error',
        message: 'Trade not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: trade
    });
  } catch (error) {
    console.error('Get trade error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Update a trade
 * PUT /api/trades/:id
 */
export const updateTrade = async (req, res) => {
  try {
    const { 
      pair, 
      market,
      instrumentType,
      direction,
      entry, 
      stopLoss,
      takeProfit,
      exit, 
      lotSize,
      pnl, 
      rr,
      session,
      strategy,
      ruleFollowed,
      emotion,
      tradeQuality,
      screenshot,
      notes, 
      date 
    } = req.body;

    const trade = await Trade.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId
      },
      {
        pair,
        market,
        instrumentType,
        direction,
        entry,
        stopLoss,
        takeProfit,
        exit,
        lotSize,
        pnl,
        rr,
        session,
        strategy,
        ruleFollowed,
        emotion,
        tradeQuality,
        screenshot,
        notes,
        date
      },
      { new: true, runValidators: true }
    );

    if (!trade) {
      return res.status(404).json({
        status: 'error',
        message: 'Trade not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: trade
    });
  } catch (error) {
    console.error('Update trade error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Delete a trade
 * DELETE /api/trades/:id
 */
export const deleteTrade = async (req, res) => {
  try {
    const trade = await Trade.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!trade) {
      return res.status(404).json({
        status: 'error',
        message: 'Trade not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Trade deleted successfully'
    });
  } catch (error) {
    console.error('Delete trade error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
