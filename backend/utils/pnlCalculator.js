/**
 * P&L CALCULATOR - CENTRALIZED PROFIT & LOSS CALCULATIONS
 * ========================================================
 * 
 * Production-grade P&L calculation engine for multi-market trading system.
 * 
 * Architecture principles:
 * - Single source of truth for P&L calculations
 * - Market-agnostic interface with market-specific implementations
 * - Consistent handling of Buy/Sell directions
 * - Proper use of contract sizes from contractSpecs
 * 
 * P&L Formula:
 * -----------
 * For LOT-BASED instruments (Forex, Commodity, Crypto, Indian F&O):
 *   P&L = (Exit - Entry) × ContractSize × LotSize × Direction
 *   where Direction = +1 for Buy, -1 for Sell
 * 
 * For QUANTITY-BASED instruments (Indian Cash Equity):
 *   P&L = (Exit - Entry) × Quantity × Direction
 * 
 * @module pnlCalculator
 * @version 2.0.0
 * @since 2026-02-15
 */

import { 
  getContractSpec, 
  getContractSize, 
  getPositionSize,
  MARKET_TYPES,
  LOT_TYPES 
} from '../config/contractSpecs.js';

/**
 * Calculate P&L for a trade
 * 
 * @param {Object} params - Trade parameters
 * @param {string} params.market - Market type (FOREX, COMMODITY, CRYPTO, INDIAN)
 * @param {string} [params.symbol] - Trading symbol/pair
 * @param {string} [params.instrumentType] - Instrument type (for Indian market)
 * @param {number} params.entryPrice - Entry price
 * @param {number} params.exitPrice - Exit price
 * @param {number} params.lotSize - Lot size (or quantity for equity)
 * @param {string} params.direction - Trade direction ('Buy' or 'Sell')
 * @returns {number} Profit/Loss amount
 * 
 * @example
 * // Forex trade: Buy 0.1 lots EURUSD at 1.1000, exit at 1.1050
 * calculatePnL({
 *   market: 'FOREX',
 *   symbol: 'EURUSD',
 *   entryPrice: 1.1000,
 *   exitPrice: 1.1050,
 *   lotSize: 0.1,
 *   direction: 'Buy'
 * })
 * // Returns: 50 (0.0050 × 100,000 × 0.1 = $50)
 * 
 * @example
 * // Indian F&O: Buy 2 lots NIFTY at 18000, exit at 18100
 * calculatePnL({
 *   market: 'INDIAN',
 *   symbol: 'NIFTY',
 *   instrumentType: 'INDEX',
 *   entryPrice: 18000,
 *   exitPrice: 18100,
 *   lotSize: 2,
 *   direction: 'Buy'
 * })
 * // Returns: 10000 (100 points × 50 units/lot × 2 lots = ₹10,000)
 */
export const calculatePnL = (params) => {
  const {
    market,
    symbol,
    instrumentType,
    entryPrice,
    exitPrice,
    lotSize,
    direction
  } = params;

  // Validate required parameters
  if (!market || entryPrice === undefined || exitPrice === undefined) {
    console.warn('Missing required parameters for P&L calculation');
    return 0;
  }

  const entry = parseFloat(entryPrice);
  const exit = parseFloat(exitPrice);
  const size = parseFloat(lotSize || 0);

  // Validate numeric values
  if (isNaN(entry) || isNaN(exit) || isNaN(size) || size <= 0) {
    console.warn('Invalid numeric values for P&L calculation');
    return 0;
  }

  // Get contract specification
  const spec = getContractSpec({ market, symbol, instrumentType });
  
  // Calculate base price difference
  let priceDiff = 0;
  
  // Direction multiplier: +1 for Buy (profit when price goes up), -1 for Sell (profit when price goes down)
  const directionMultiplier = (direction === 'Buy') ? 1 : -1;
  
  priceDiff = (exit - entry) * directionMultiplier;

  // Calculate P&L based on lot type
  let pnl = 0;

  if (spec.lotType === LOT_TYPES.NONE) {
    // Quantity-based (Indian Cash Equity)
    // P&L = price difference × quantity
    pnl = priceDiff * size;
  } else {
    // Lot-based (Forex, Commodity, Crypto, Indian F&O)
    // P&L = price difference × contract size × lot size
    const contractSize = spec.contractSize || 1;
    pnl = priceDiff * contractSize * size;
  }

  return parseFloat(pnl.toFixed(2));
};

/**
 * Calculate Risk:Reward Ratio
 * 
 * @param {Object} params - Trade parameters
 * @param {number} params.entryPrice - Entry price
 * @param {number} params.stopLoss - Stop loss price
 * @param {number} params.takeProfit - Take profit price
 * @param {string} params.direction - Trade direction ('Buy' or 'Sell')
 * @returns {number} Risk:Reward ratio (reward / risk)
 * 
 * @example
 * // Buy trade: Entry 100, SL 98, TP 106
 * calculateRiskReward({
 *   entryPrice: 100,
 *   stopLoss: 98,
 *   takeProfit: 106,
 *   direction: 'Buy'
 * })
 * // Returns: 3 (reward: 6 points, risk: 2 points, RR = 6/2 = 3)
 */
export const calculateRiskReward = (params) => {
  const { entryPrice, stopLoss, takeProfit, direction } = params;

  // Validate required parameters
  if (entryPrice === undefined || stopLoss === undefined || takeProfit === undefined || !direction) {
    return 0;
  }

  const entry = parseFloat(entryPrice);
  const sl = parseFloat(stopLoss);
  const tp = parseFloat(takeProfit);

  // Validate numeric values
  if (isNaN(entry) || isNaN(sl) || isNaN(tp)) {
    return 0;
  }

  let risk = 0;
  let reward = 0;

  if (direction === 'Buy') {
    risk = entry - sl;      // Price distance from entry to stop loss
    reward = tp - entry;    // Price distance from entry to take profit
  } else if (direction === 'Sell') {
    risk = sl - entry;      // Price distance from entry to stop loss
    reward = entry - tp;    // Price distance from entry to take profit
  }

  // Prevent division by zero
  if (risk <= 0) {
    return 0;
  }

  const rr = reward / risk;
  return parseFloat(rr.toFixed(2));
};

/**
 * Calculate actual risk amount in currency
 * 
 * @param {Object} params - Trade parameters (same as calculatePnL, but uses stopLoss as exitPrice)
 * @returns {number} Risk amount in currency
 */
export const calculateRiskAmount = (params) => {
  const riskParams = {
    ...params,
    exitPrice: params.stopLoss
  };

  // Risk is always negative (loss), so we return absolute value
  const riskPnL = calculatePnL(riskParams);
  return Math.abs(riskPnL);
};

/**
 * Calculate potential reward amount in currency
 * 
 * @param {Object} params - Trade parameters (same as calculatePnL, but uses takeProfit as exitPrice)
 * @returns {number} Reward amount in currency
 */
export const calculateRewardAmount = (params) => {
  const rewardParams = {
    ...params,
    exitPrice: params.takeProfit
  };

  // Reward should be positive
  const rewardPnL = calculatePnL(rewardParams);
  return Math.abs(rewardPnL);
};

/**
 * Calculate position value at entry
 * 
 * @param {Object} params - Trade parameters
 * @returns {number} Position value in currency
 * 
 * @example
 * // Forex: 0.1 lots EURUSD at 1.1000
 * calculatePositionValue({
 *   market: 'FOREX',
 *   symbol: 'EURUSD',
 *   entryPrice: 1.1000,
 *   lotSize: 0.1
 * })
 * // Returns: 11000 (1.1000 × 100,000 × 0.1 = $11,000 worth of EUR)
 */
export const calculatePositionValue = (params) => {
  const { market, symbol, instrumentType, entryPrice, lotSize } = params;

  if (!market || entryPrice === undefined || lotSize === undefined) {
    return 0;
  }

  const entry = parseFloat(entryPrice);
  const size = parseFloat(lotSize);

  if (isNaN(entry) || isNaN(size) || size <= 0) {
    return 0;
  }

  const positionSize = getPositionSize({ market, symbol, instrumentType, lotSize: size });
  const positionValue = entry * positionSize;

  return parseFloat(positionValue.toFixed(2));
};

/**
 * Batch calculate multiple trade metrics
 * Useful for retrieving all metrics in one call
 * 
 * @param {Object} params - Trade parameters
 * @returns {Object} Object containing pnl, rr, riskAmount, rewardAmount, positionValue
 */
export const calculateTradeMetrics = (params) => {
  const {
    market,
    symbol,
    instrumentType,
    entryPrice,
    exitPrice,
    stopLoss,
    takeProfit,
    lotSize,
    direction
  } = params;

  // Calculate all metrics
  const pnl = exitPrice ? calculatePnL(params) : null;
  const rr = (stopLoss && takeProfit) ? calculateRiskReward(params) : null;
  const riskAmount = stopLoss ? calculateRiskAmount(params) : null;
  const rewardAmount = takeProfit ? calculateRewardAmount(params) : null;
  const positionValue = calculatePositionValue(params);

  return {
    pnl,
    rr,
    riskAmount,
    rewardAmount,
    positionValue,
    contractSpec: getContractSpec({ market, symbol, instrumentType })
  };
};

/**
 * Validate trade parameters before calculation
 * 
 * @param {Object} params - Trade parameters
 * @returns {Object} Validation result { valid: boolean, errors: string[] }
 */
export const validateTradeParams = (params) => {
  const {
    market,
    entryPrice,
    exitPrice,
    lotSize,
    direction
  } = params;

  const errors = [];

  if (!market) {
    errors.push('Market type is required');
  }

  if (entryPrice === undefined || isNaN(parseFloat(entryPrice))) {
    errors.push('Valid entry price is required');
  }

  if (exitPrice !== undefined && isNaN(parseFloat(exitPrice))) {
    errors.push('Exit price must be a valid number');
  }

  if (lotSize === undefined || isNaN(parseFloat(lotSize)) || parseFloat(lotSize) <= 0) {
    errors.push('Valid lot size/quantity is required (must be greater than 0)');
  }

  if (!direction || !['Buy', 'Sell'].includes(direction)) {
    errors.push('Direction must be either "Buy" or "Sell"');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Format P&L for display
 * 
 * @param {number} pnl - P&L amount
 * @param {string} currency - Currency code (USD, INR, etc.)
 * @returns {string} Formatted P&L string
 */
export const formatPnL = (pnl, currency = 'USD') => {
  if (pnl === null || pnl === undefined || isNaN(pnl)) {
    return 'N/A';
  }

  const sign = pnl >= 0 ? '+' : '';
  const currencySymbol = currency === 'INR' ? '₹' : '$';
  
  return `${sign}${currencySymbol}${Math.abs(pnl).toFixed(2)}`;
};

// Export all functions
export default {
  calculatePnL,
  calculateRiskReward,
  calculateRiskAmount,
  calculateRewardAmount,
  calculatePositionValue,
  calculateTradeMetrics,
  validateTradeParams,
  formatPnL
};
