// Trade controller
// Handlers: createTrade, getTrades, getTradeById, updateTrade, deleteTrade

import Trade from '../models/Trade.js';
import { getPositionSize } from '../../config/contractSpecs.js';
import { calculatePnL, calculateRiskReward } from '../../utils/pnlCalculator.js';
import { getTradeCurrencyFromPair } from '../utils/getTradeCurrencyFromPair.js';
import { getTodayUsdInrRate } from '../services/exchangeRateService.js';

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
    // Using centralized position size calculator
    let actualQuantity = quantity;
    let effectiveLotSize = lotSize;
    
    if (market === 'INDIAN' && (instrumentType === 'INDEX' || instrumentType === 'FNO')) {
      // For Indian F&O, lots field is used
      effectiveLotSize = lots;
      actualQuantity = getPositionSize({ 
        market, 
        symbol, 
        instrumentType, 
        lotSize: lots 
      });
    } else if (market === 'INDIAN' && instrumentType === 'EQUITY') {
      // For Indian equity, quantity is used directly
      effectiveLotSize = quantity;
      actualQuantity = quantity;
    }
    
    // Calculate P&L using centralized calculator
    let calculatedPnl = pnl || 0;
    let calculatedRr = rr || 0;
    
    if (entry && exit) {
      // Use centralized P&L calculator
      calculatedPnl = calculatePnL({
        market,
        symbol: symbol || pair,
        instrumentType,
        entryPrice: entry,
        exitPrice: exit,
        lotSize: effectiveLotSize,
        direction
      });
      
      // Calculate R:R using centralized calculator
      if (stopLoss && takeProfit) {
        calculatedRr = calculateRiskReward({
          entryPrice: entry,
          stopLoss,
          takeProfit,
          direction
        });
      }
    }
    
    // === CURRENCY LOGIC ===
    // Determine trade currency based on market and pair
    const tradeCurrency = getTradeCurrencyFromPair({ pair, market, symbol });
    
    // Get account currency from request (defaults to USD)
    const accountCurrency = req.body.accountCurrency || 'USD';
    
    // ALWAYS fetch today's USD/INR rate, regardless of currency match
    // This ensures correct conversion if user later changes their account currency
    const todayRate = await getTodayUsdInrRate();
    
    // Store the actual exchange rate at trade execution time
    // This rate is immutable and will be used for all future conversions
    let exchangeRateAtExecution = todayRate;
    
    // Note: We no longer skip fetching when currencies match
    // Even if tradeCurrency === accountCurrency today, the user might switch later
    // and we need the historical rate for accurate conversion
    // === END CURRENCY LOGIC ===
    
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
      tradeCurrency,
      exchangeRateAtExecution,
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
    // Using centralized position size calculator
    let actualQuantity = quantity;
    let effectiveLotSize = lotSize;
    
    if (market === 'INDIAN' && (instrumentType === 'INDEX' || instrumentType === 'FNO')) {
      // For Indian F&O, lots field is used
      effectiveLotSize = lots;
      actualQuantity = getPositionSize({ 
        market, 
        symbol, 
        instrumentType, 
        lotSize: lots 
      });
    } else if (market === 'INDIAN' && instrumentType === 'EQUITY') {
      // For Indian equity, quantity is used directly
      effectiveLotSize = quantity;
      actualQuantity = quantity;
    }

    // Calculate P&L using centralized calculator
    let calculatedPnl = pnl || 0;
    let calculatedRr = rr || 0;
    
    if (entry && exit) {
      // Use centralized P&L calculator
      calculatedPnl = calculatePnL({
        market,
        symbol: symbol || pair,
        instrumentType,
        entryPrice: entry,
        exitPrice: exit,
        lotSize: effectiveLotSize,
        direction
      });
      
      // Calculate R:R using centralized calculator
      if (stopLoss && takeProfit) {
        calculatedRr = calculateRiskReward({
          entryPrice: entry,
          stopLoss,
          takeProfit,
          direction
        });
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
