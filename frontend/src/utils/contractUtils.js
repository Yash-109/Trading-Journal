/**
 * CONTRACT UTILITIES - FRONTEND
 * ==============================
 * 
 * Frontend utilities for contract specifications and P&L calculations.
 * Mirror of backend contractSpecs.js and pnlCalculator.js for client-side use.
 * 
 * @module contractUtils
 * @version 2.0.0
 * @since 2026-02-15
 */

/**
 * Market Types
 */
export const MARKET_TYPES = {
  FOREX: 'FOREX',
  COMMODITY: 'COMMODITY',
  CRYPTO: 'CRYPTO',
  INDIAN: 'INDIAN'
};

/**
 * Lot Types
 */
export const LOT_TYPES = {
  FIXED: 'FIXED',
  FLEXIBLE: 'FLEXIBLE',
  NONE: 'NONE'
};

/**
 * Contract Specifications
 * Centralized configuration for all instruments
 */
const CONTRACT_SPECS = {
  // FOREX (Standard lot = 100,000 units)
  FOREX: {
    EURUSD: { contractSize: 100000, lotType: LOT_TYPES.FIXED, minLotSize: 0.01, lotIncrement: 0.01 },
    GBPUSD: { contractSize: 100000, lotType: LOT_TYPES.FIXED, minLotSize: 0.01, lotIncrement: 0.01 },
    USDJPY: { contractSize: 100000, lotType: LOT_TYPES.FIXED, minLotSize: 0.01, lotIncrement: 0.01 },
    AUDUSD: { contractSize: 100000, lotType: LOT_TYPES.FIXED, minLotSize: 0.01, lotIncrement: 0.01 },
    USDCAD: { contractSize: 100000, lotType: LOT_TYPES.FIXED, minLotSize: 0.01, lotIncrement: 0.01 },
    DEFAULT: { contractSize: 100000, lotType: LOT_TYPES.FIXED, minLotSize: 0.01, lotIncrement: 0.01 }
  },
  // COMMODITY
  COMMODITY: {
    XAUUSD: { contractSize: 100, lotType: LOT_TYPES.FIXED, minLotSize: 0.01, lotIncrement: 0.01 },
    DEFAULT: { contractSize: 100, lotType: LOT_TYPES.FIXED, minLotSize: 0.01, lotIncrement: 0.01 }
  },
  // CRYPTO
  CRYPTO: {
    BTCUSD: { contractSize: 1, lotType: LOT_TYPES.FIXED, minLotSize: 0.01, lotIncrement: 0.01 },
    ETHUSD: { contractSize: 1, lotType: LOT_TYPES.FIXED, minLotSize: 0.01, lotIncrement: 0.01 },
    DEFAULT: { contractSize: 1, lotType: LOT_TYPES.FIXED, minLotSize: 0.01, lotIncrement: 0.01 }
  },
  // INDIAN F&O (NSE/BSE lot sizes)
  INDIAN_FNO: {
    NIFTY: { contractSize: 50, lotType: LOT_TYPES.FLEXIBLE, minLotSize: 1, lotIncrement: 1 },
    BANKNIFTY: { contractSize: 15, lotType: LOT_TYPES.FLEXIBLE, minLotSize: 1, lotIncrement: 1 },
    FINNIFTY: { contractSize: 40, lotType: LOT_TYPES.FLEXIBLE, minLotSize: 1, lotIncrement: 1 },
    MIDCPNIFTY: { contractSize: 75, lotType: LOT_TYPES.FLEXIBLE, minLotSize: 1, lotIncrement: 1 },
    SENSEX: { contractSize: 10, lotType: LOT_TYPES.FLEXIBLE, minLotSize: 1, lotIncrement: 1 }
  },
  // INDIAN EQUITY
  INDIAN_EQUITY: {
    DEFAULT: { contractSize: 1, lotType: LOT_TYPES.NONE, minQuantity: 1, quantityIncrement: 1 }
  }
};

/**
 * Get contract specification for an instrument
 */
export const getContractSpec = ({ market, symbol, instrumentType }) => {
  if (!market) {
    return { contractSize: 1, lotType: LOT_TYPES.NONE };
  }

  const upperMarket = market.toUpperCase();
  const upperSymbol = symbol ? symbol.toUpperCase().trim() : null;

  // Indian market
  if (upperMarket === MARKET_TYPES.INDIAN) {
    if (instrumentType === 'EQUITY') {
      return CONTRACT_SPECS.INDIAN_EQUITY.DEFAULT;
    }
    
    if (instrumentType === 'INDEX' || instrumentType === 'FNO') {
      if (!upperSymbol) {
        return CONTRACT_SPECS.INDIAN_EQUITY.DEFAULT;
      }
      return CONTRACT_SPECS.INDIAN_FNO[upperSymbol] || CONTRACT_SPECS.INDIAN_EQUITY.DEFAULT;
    }

    return CONTRACT_SPECS.INDIAN_EQUITY.DEFAULT;
  }

  // Other markets
  const marketSpecs = CONTRACT_SPECS[upperMarket];
  if (!marketSpecs) {
    return { contractSize: 1, lotType: LOT_TYPES.NONE };
  }

  if (!upperSymbol) {
    return marketSpecs.DEFAULT || { contractSize: 1, lotType: LOT_TYPES.FIXED };
  }

  return marketSpecs[upperSymbol] || marketSpecs.DEFAULT || { contractSize: 1, lotType: LOT_TYPES.FIXED };
};

/**
 * Get contract size for an instrument
 */
export const getContractSize = (params) => {
  const spec = getContractSpec(params);
  return spec.contractSize || 1;
};

/**
 * Calculate position size (total units) from lot size
 */
export const getPositionSize = (params) => {
  const { lotSize } = params;
  
  if (!lotSize || isNaN(lotSize)) {
    return 0;
  }

  const contractSize = getContractSize(params);
  return contractSize * parseFloat(lotSize);
};

/**
 * Calculate P&L for a trade
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

  if (!market || entryPrice === undefined || exitPrice === undefined) {
    return 0;
  }

  const entry = parseFloat(entryPrice);
  const exit = parseFloat(exitPrice);
  const size = parseFloat(lotSize || 0);

  if (isNaN(entry) || isNaN(exit) || isNaN(size) || size <= 0) {
    return 0;
  }

  const spec = getContractSpec({ market, symbol, instrumentType });
  
  // Direction multiplier
  const directionMultiplier = (direction === 'Buy') ? 1 : -1;
  const priceDiff = (exit - entry) * directionMultiplier;

  // Calculate P&L
  let pnl = 0;

  if (spec.lotType === LOT_TYPES.NONE) {
    // Quantity-based
    pnl = priceDiff * size;
  } else {
    // Lot-based
    const contractSize = spec.contractSize || 1;
    pnl = priceDiff * contractSize * size;
  }

  return parseFloat(pnl.toFixed(2));
};

/**
 * Calculate Risk:Reward Ratio
 */
export const calculateRiskReward = (params) => {
  const { entryPrice, stopLoss, takeProfit, direction } = params;

  if (entryPrice === undefined || stopLoss === undefined || takeProfit === undefined || !direction) {
    return 0;
  }

  const entry = parseFloat(entryPrice);
  const sl = parseFloat(stopLoss);
  const tp = parseFloat(takeProfit);

  if (isNaN(entry) || isNaN(sl) || isNaN(tp)) {
    return 0;
  }

  let risk = 0;
  let reward = 0;

  if (direction === 'Buy') {
    risk = entry - sl;
    reward = tp - entry;
  } else if (direction === 'Sell') {
    risk = sl - entry;
    reward = entry - tp;
  }

  if (risk <= 0) {
    return 0;
  }

  const rr = reward / risk;
  return parseFloat(rr.toFixed(2));
};

/**
 * Get display label for lot/quantity field
 */
export const getLotFieldLabel = ({ market, instrumentType }) => {
  if (!market) return 'Quantity';

  const upperMarket = market.toUpperCase();

  if (upperMarket === MARKET_TYPES.INDIAN) {
    if (instrumentType === 'EQUITY') {
      return 'Quantity';
    }
    return 'Lots';
  }

  return 'Lot Size';
};

/**
 * Check if instrument uses lot-based trading
 */
export const isLotBased = (params) => {
  const spec = getContractSpec(params);
  return spec.lotType !== LOT_TYPES.NONE;
};

/**
 * Validate lot size
 */
export const validateLotSize = (params) => {
  const { lotSize } = params;
  const spec = getContractSpec(params);

  if (!lotSize || isNaN(lotSize)) {
    return { valid: false, message: 'Lot size must be a valid number' };
  }

  const lot = parseFloat(lotSize);

  if (lot <= 0) {
    return { valid: false, message: 'Lot size must be greater than 0' };
  }

  if (spec.minLotSize && lot < spec.minLotSize) {
    return { valid: false, message: `Minimum lot size is ${spec.minLotSize}` };
  }

  if (spec.lotIncrement) {
    const remainder = lot % spec.lotIncrement;
    if (remainder !== 0 && remainder > 0.000001) {
      return { valid: false, message: `Lot size must be in increments of ${spec.lotIncrement}` };
    }
  }

  // Indian FNO lots must be whole numbers
  if (spec.lotType === LOT_TYPES.FLEXIBLE && lot !== Math.floor(lot)) {
    return { valid: false, message: 'Lots must be whole numbers for Indian F&O' };
  }

  return { valid: true, message: 'Valid' };
};

/**
 * Get contract info text for display
 */
export const getContractInfo = (params) => {
  const { market, symbol, instrumentType } = params;
  const spec = getContractSpec({ market, symbol, instrumentType });

  if (!spec || !spec.contractSize) {
    return null;
  }

  const upperMarket = market?.toUpperCase();
  const upperSymbol = symbol?.toUpperCase();

  // FOREX
  if (upperMarket === 'FOREX') {
    return '1 lot = 100,000 units';
  }

  // COMMODITY
  if (upperMarket === 'COMMODITY' && upperSymbol === 'XAUUSD') {
    return '1 lot = 100 oz ($1 move = $100/lot)';
  }

  // CRYPTO
  if (upperMarket === 'CRYPTO') {
    if (upperSymbol?.includes('BTC')) {
      return '1 lot = 1 BTC';
    }
    if (upperSymbol?.includes('ETH')) {
      return '1 lot = 1 ETH';
    }
    return '1 lot = 1 unit';
  }

  // INDIAN F&O
  if (upperMarket === 'INDIAN' && (instrumentType === 'INDEX' || instrumentType === 'FNO')) {
    const lotSize = spec.contractSize;
    const pointValue = lotSize; // For simplicity
    return `Lot size: ${lotSize} units | ₹${pointValue} per point`;
  }

  return null;
};

/**
 * Get lot size options for Indian F&O symbols
 */
export const getIndianFnoLotSize = (symbol) => {
  if (!symbol) return null;
  
  const upperSymbol = symbol.toUpperCase();
  const spec = CONTRACT_SPECS.INDIAN_FNO[upperSymbol];
  
  return spec ? spec.contractSize : null;
};

export default {
  MARKET_TYPES,
  LOT_TYPES,
  getContractSpec,
  getContractSize,
  getPositionSize,
  calculatePnL,
  calculateRiskReward,
  getLotFieldLabel,
  isLotBased,
  validateLotSize,
  getContractInfo,
  getIndianFnoLotSize
};
