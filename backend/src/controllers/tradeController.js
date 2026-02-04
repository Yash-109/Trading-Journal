// Trade controller
// Handlers: createTrade, getTrades, getTradeById, updateTrade, deleteTrade

import Trade from '../models/Trade.js';
import { calculateQuantityFromLots } from '../../config/indianMarket.js';

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
      // Indian market fields
      symbol,
      quantity,
      lots,
      optionType,
      strikePrice,
      expiryDate,
      // Common fields
      pnl, 
      rr,
      session,
      strategy,
      ruleFollowed,
      emotion,
      tradeQuality,
      notes, 
      date 
    } = req.body;
    
    // Calculate actual quantity from lots for Indian INDEX/FNO
    let actualQuantity = quantity;
    if (market === 'INDIAN' && (instrumentType === 'INDEX' || instrumentType === 'FNO') && lots) {
      actualQuantity = calculateQuantityFromLots(symbol, lots);
    }
    
    // Calculate P/L and R:R
    let calculatedPnl = pnl || 0;
    let calculatedRr = rr || 0;
    
    if (entry && exit) {
      const entryPrice = parseFloat(entry);
      const exitPrice = parseFloat(exit);
      
      // P/L calculation based on market type
      if (market === 'INDIAN' && actualQuantity) {
        const qty = parseFloat(actualQuantity);
        // Indian market: quantity-based calculation (no charges)
        if (direction === 'Buy') {
          calculatedPnl = (exitPrice - entryPrice) * qty;
        } else if (direction === 'Sell') {
          calculatedPnl = (entryPrice - exitPrice) * qty;
        }
      } else if (lotSize) {
        // FOREX/CRYPTO: lot-based calculation (no charges)
        const lot = parseFloat(lotSize);
        if (direction === 'Buy') {
          calculatedPnl = (exitPrice - entryPrice) * lot;
        } else if (direction === 'Sell') {
          calculatedPnl = (entryPrice - exitPrice) * lot;
        }
      }
      
      // R:R calculation (same for all markets)
      if (stopLoss && takeProfit) {
        const slPrice = parseFloat(stopLoss);
        const tpPrice = parseFloat(takeProfit);
        
        if (direction === 'Buy') {
          const risk = entryPrice - slPrice;
          const reward = tpPrice - entryPrice;
          calculatedRr = risk !== 0 ? reward / risk : 0;
        } else if (direction === 'Sell') {
          const risk = slPrice - entryPrice;
          const reward = entryPrice - tpPrice;
          calculatedRr = risk !== 0 ? reward / risk : 0;
        }
      }
    }
    
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
      // Indian market fields
      symbol,
      quantity: actualQuantity,
      lots,
      optionType,
      strikePrice,
      expiryDate,
      // Common fields
      pnl: calculatedPnl,
      rr: calculatedRr,
      session,
      strategy,
      ruleFollowed,
      emotion,
      tradeQuality,
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
      // Indian market fields
      symbol,
      quantity,
      lots,
      optionType,
      strikePrice,
      expiryDate,
      // Common fields
      pnl, 
      rr,
      session,
      strategy,
      ruleFollowed,
      emotion,
      tradeQuality,
      notes, 
      date 
    } = req.body;

    // Calculate actual quantity from lots for Indian INDEX/FNO
    let actualQuantity = quantity;
    if (market === 'INDIAN' && (instrumentType === 'INDEX' || instrumentType === 'FNO') && lots) {
      actualQuantity = calculateQuantityFromLots(symbol, lots);
    }

    // Calculate P/L and R:R
    let calculatedPnl = pnl || 0;
    let calculatedRr = rr || 0;
    
    if (entry && exit) {
      const entryPrice = parseFloat(entry);
      const exitPrice = parseFloat(exit);
      
      // P/L calculation based on market type
      if (market === 'INDIAN' && actualQuantity) {
        const qty = parseFloat(actualQuantity);
        // Indian market: quantity-based calculation (no charges)
        if (direction === 'Buy') {
          calculatedPnl = (exitPrice - entryPrice) * qty;
        } else if (direction === 'Sell') {
          calculatedPnl = (entryPrice - exitPrice) * qty;
        }
      } else if (lotSize) {
        // FOREX/CRYPTO: lot-based calculation (no charges)
        const lot = parseFloat(lotSize);
        if (direction === 'Buy') {
          calculatedPnl = (exitPrice - entryPrice) * lot;
        } else if (direction === 'Sell') {
          calculatedPnl = (entryPrice - exitPrice) * lot;
        }
      }
      
      // R:R calculation (same for all markets)
      if (stopLoss && takeProfit) {
        const slPrice = parseFloat(stopLoss);
        const tpPrice = parseFloat(takeProfit);
        
        if (direction === 'Buy') {
          const risk = entryPrice - slPrice;
          const reward = tpPrice - entryPrice;
          calculatedRr = risk !== 0 ? reward / risk : 0;
        } else if (direction === 'Sell') {
          const risk = slPrice - entryPrice;
          const reward = entryPrice - tpPrice;
          calculatedRr = risk !== 0 ? reward / risk : 0;
        }
      }
    }

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
        // Indian market fields
        symbol,
        quantity: actualQuantity,
        lots,
        optionType,
        strikePrice,
        expiryDate,
        // Common fields
        pnl: calculatedPnl,
        rr: calculatedRr,
        session,
        strategy,
        ruleFollowed,
        emotion,
        tradeQuality,
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
