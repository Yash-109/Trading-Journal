/**
 * CONTRACT SPECIFICATIONS - CENTRALIZED CONFIGURATION
 * ===================================================
 * 
 * Production-grade contract size definitions for multi-market trading system.
 * 
 * This module provides:
 * - Standardized contract sizes for all supported instruments
 * - Market type classifications
 * - Lot type definitions (fixed/flexible/none)
 * - Scalable structure for adding new instruments
 * 
 * @module contractSpecs
 * @version 2.0.0
 * @since 2026-02-15
 */

/**
 * Market Types
 * Defines available trading markets in the system
 */
export const MARKET_TYPES = {
  FOREX: 'FOREX',
  COMMODITY: 'COMMODITY',
  CRYPTO: 'CRYPTO',
  INDIAN: 'INDIAN'
};

/**
 * Lot Types
 * Defines how position sizing works for each instrument
 */
export const LOT_TYPES = {
  FIXED: 'FIXED',         // Fixed lot size (e.g., Forex standard lot)
  FLEXIBLE: 'FLEXIBLE',   // Flexible lot size (e.g., Indian F&O)
  NONE: 'NONE'            // No lot system (e.g., Indian cash equity)
};

/**
 * FOREX Market Specifications
 * Standard lot = 100,000 units of base currency
 * 
 * Note: Mini lot = 0.1 (10,000 units), Micro lot = 0.01 (1,000 units)
 */
const FOREX_SPECS = {
  EURUSD: {
    symbol: 'EURUSD',
    name: 'Euro / US Dollar',
    contractSize: 100000,
    lotType: LOT_TYPES.FIXED,
    minLotSize: 0.01,
    lotIncrement: 0.01,
    baseCurrency: 'EUR',
    quoteCurrency: 'USD',
    pipValue: 10, // For 1 standard lot ($10 per pip)
    marketType: MARKET_TYPES.FOREX
  },
  GBPUSD: {
    symbol: 'GBPUSD',
    name: 'British Pound / US Dollar',
    contractSize: 100000,
    lotType: LOT_TYPES.FIXED,
    minLotSize: 0.01,
    lotIncrement: 0.01,
    baseCurrency: 'GBP',
    quoteCurrency: 'USD',
    pipValue: 10,
    marketType: MARKET_TYPES.FOREX
  },
  USDJPY: {
    symbol: 'USDJPY',
    name: 'US Dollar / Japanese Yen',
    contractSize: 100000,
    lotType: LOT_TYPES.FIXED,
    minLotSize: 0.01,
    lotIncrement: 0.01,
    baseCurrency: 'USD',
    quoteCurrency: 'JPY',
    pipValue: 1000, // JPY is quoted differently
    marketType: MARKET_TYPES.FOREX
  },
  AUDUSD: {
    symbol: 'AUDUSD',
    name: 'Australian Dollar / US Dollar',
    contractSize: 100000,
    lotType: LOT_TYPES.FIXED,
    minLotSize: 0.01,
    lotIncrement: 0.01,
    baseCurrency: 'AUD',
    quoteCurrency: 'USD',
    pipValue: 10,
    marketType: MARKET_TYPES.FOREX
  },
  USDCAD: {
    symbol: 'USDCAD',
    name: 'US Dollar / Canadian Dollar',
    contractSize: 100000,
    lotType: LOT_TYPES.FIXED,
    minLotSize: 0.01,
    lotIncrement: 0.01,
    baseCurrency: 'USD',
    quoteCurrency: 'CAD',
    pipValue: 10,
    marketType: MARKET_TYPES.FOREX
  },
  // Default for unknown FOREX pairs
  DEFAULT: {
    symbol: 'DEFAULT',
    name: 'Default Forex Pair',
    contractSize: 100000,
    lotType: LOT_TYPES.FIXED,
    minLotSize: 0.01,
    lotIncrement: 0.01,
    pipValue: 10,
    marketType: MARKET_TYPES.FOREX
  }
};

/**
 * COMMODITY Market Specifications
 * CFD-style contracts with specific lot sizes
 */
const COMMODITY_SPECS = {
  XAUUSD: {
    symbol: 'XAUUSD',
    name: 'Gold vs US Dollar',
    contractSize: 100,      // 100 troy ounces per lot
    lotType: LOT_TYPES.FIXED,
    minLotSize: 0.01,
    lotIncrement: 0.01,
    unit: 'troy ounces',
    pointValue: 100,        // $1 move = $100 per lot
    quoteCurrency: 'USD',
    marketType: MARKET_TYPES.COMMODITY
  },
  // Default for unknown commodities
  DEFAULT: {
    symbol: 'DEFAULT',
    name: 'Default Commodity',
    contractSize: 100,
    lotType: LOT_TYPES.FIXED,
    minLotSize: 0.01,
    lotIncrement: 0.01,
    marketType: MARKET_TYPES.COMMODITY
  }
};

/**
 * CRYPTO Market Specifications
 * CFD assumption: 1 lot = 1 unit of cryptocurrency
 */
const CRYPTO_SPECS = {
  BTCUSD: {
    symbol: 'BTCUSD',
    name: 'Bitcoin / US Dollar',
    contractSize: 1,        // 1 BTC per lot
    lotType: LOT_TYPES.FIXED,
    minLotSize: 0.01,
    lotIncrement: 0.01,
    unit: 'BTC',
    quoteCurrency: 'USD',
    marketType: MARKET_TYPES.CRYPTO
  },
  ETHUSD: {
    symbol: 'ETHUSD',
    name: 'Ethereum / US Dollar',
    contractSize: 1,        // 1 ETH per lot
    lotType: LOT_TYPES.FIXED,
    minLotSize: 0.01,
    lotIncrement: 0.01,
    unit: 'ETH',
    quoteCurrency: 'USD',
    marketType: MARKET_TYPES.CRYPTO
  },
  // Default for unknown crypto pairs
  DEFAULT: {
    symbol: 'DEFAULT',
    name: 'Default Crypto Pair',
    contractSize: 1,
    lotType: LOT_TYPES.FIXED,
    minLotSize: 0.01,
    lotIncrement: 0.01,
    marketType: MARKET_TYPES.CRYPTO
  }
};

/**
 * INDIAN F&O Market Specifications
 * Official NSE lot sizes for Index Futures & Options
 * 
 * Source: NSE India official specifications
 * Last verified: February 2026
 * 
 * IMPORTANT: NSE may change lot sizes periodically.
 * Always refer to NSE circulars for current specifications.
 */
const INDIAN_FNO_SPECS = {
  NIFTY: {
    symbol: 'NIFTY',
    name: 'NIFTY 50 Index',
    contractSize: 50,       // 50 units per lot (NSE specification)
    lotType: LOT_TYPES.FLEXIBLE,
    minLotSize: 1,
    lotIncrement: 1,
    unit: 'units',
    pointValue: 50,         // ₹50 per point movement
    quoteCurrency: 'INR',
    marketType: MARKET_TYPES.INDIAN,
    instrumentType: 'INDEX'
  },
  BANKNIFTY: {
    symbol: 'BANKNIFTY',
    name: 'Bank NIFTY Index',
    contractSize: 15,       // 15 units per lot (NSE specification)
    lotType: LOT_TYPES.FLEXIBLE,
    minLotSize: 1,
    lotIncrement: 1,
    unit: 'units',
    pointValue: 15,         // ₹15 per point movement
    quoteCurrency: 'INR',
    marketType: MARKET_TYPES.INDIAN,
    instrumentType: 'INDEX'
  },
  FINNIFTY: {
    symbol: 'FINNIFTY',
    name: 'Financial Services Index',
    contractSize: 40,       // 40 units per lot (NSE specification)
    lotType: LOT_TYPES.FLEXIBLE,
    minLotSize: 1,
    lotIncrement: 1,
    unit: 'units',
    pointValue: 40,         // ₹40 per point movement
    quoteCurrency: 'INR',
    marketType: MARKET_TYPES.INDIAN,
    instrumentType: 'INDEX'
  },
  MIDCPNIFTY: {
    symbol: 'MIDCPNIFTY',
    name: 'Midcap NIFTY Index',
    contractSize: 75,       // 75 units per lot (NSE specification)
    lotType: LOT_TYPES.FLEXIBLE,
    minLotSize: 1,
    lotIncrement: 1,
    unit: 'units',
    pointValue: 75,         // ₹75 per point movement
    quoteCurrency: 'INR',
    marketType: MARKET_TYPES.INDIAN,
    instrumentType: 'INDEX'
  },
  SENSEX: {
    symbol: 'SENSEX',
    name: 'BSE SENSEX Index',
    contractSize: 10,       // 10 units per lot (BSE specification)
    lotType: LOT_TYPES.FLEXIBLE,
    minLotSize: 1,
    lotIncrement: 1,
    unit: 'units',
    pointValue: 10,         // ₹10 per point movement
    quoteCurrency: 'INR',
    marketType: MARKET_TYPES.INDIAN,
    instrumentType: 'INDEX'
  }
};

/**
 * INDIAN Cash Equity Specifications
 * No lot system - quantity-based trading
 */
const INDIAN_EQUITY_SPECS = {
  DEFAULT: {
    symbol: 'CASH_EQUITY',
    name: 'Indian Cash Equity',
    contractSize: 1,        // 1 share = 1 unit
    lotType: LOT_TYPES.NONE,
    minQuantity: 1,
    quantityIncrement: 1,
    unit: 'shares',
    quoteCurrency: 'INR',
    marketType: MARKET_TYPES.INDIAN,
    instrumentType: 'EQUITY'
  }
};

/**
 * Master Contract Specifications Registry
 * Organized by market type for efficient lookup
 */
export const CONTRACT_SPECS = {
  [MARKET_TYPES.FOREX]: FOREX_SPECS,
  [MARKET_TYPES.COMMODITY]: COMMODITY_SPECS,
  [MARKET_TYPES.CRYPTO]: CRYPTO_SPECS,
  [MARKET_TYPES.INDIAN]: {
    FNO: INDIAN_FNO_SPECS,
    INDEX: INDIAN_FNO_SPECS,  // INDEX uses same specs as FNO
    EQUITY: INDIAN_EQUITY_SPECS
  }
};

/**
 * Get contract specification for a given instrument
 * 
 * @param {Object} params - Lookup parameters
 * @param {string} params.market - Market type (FOREX, COMMODITY, CRYPTO, INDIAN)
 * @param {string} [params.symbol] - Trading symbol/pair
 * @param {string} [params.instrumentType] - Indian market instrument type (INDEX, FNO, EQUITY)
 * @returns {Object} Contract specification object
 * 
 * @example
 * // Forex
 * getContractSpec({ market: 'FOREX', symbol: 'EURUSD' })
 * 
 * @example
 * // Indian F&O
 * getContractSpec({ market: 'INDIAN', symbol: 'NIFTY', instrumentType: 'INDEX' })
 * 
 * @example
 * // Indian Cash Equity
 * getContractSpec({ market: 'INDIAN', instrumentType: 'EQUITY' })
 */
export const getContractSpec = ({ market, symbol, instrumentType }) => {
  if (!market) {
    console.warn('Market type not provided, returning default');
    return { contractSize: 1, lotType: LOT_TYPES.NONE, marketType: 'UNKNOWN' };
  }

  const upperMarket = market.toUpperCase();
  const upperSymbol = symbol ? symbol.toUpperCase().trim() : null;

  // Handle Indian market separately due to instrument types
  if (upperMarket === MARKET_TYPES.INDIAN) {
    if (!instrumentType) {
      console.warn('Indian market requires instrumentType, returning equity default');
      return INDIAN_EQUITY_SPECS.DEFAULT;
    }

    const upperInstrumentType = instrumentType.toUpperCase();

    // Cash equity (no lot system)
    if (upperInstrumentType === 'EQUITY') {
      return INDIAN_EQUITY_SPECS.DEFAULT;
    }

    // F&O or INDEX
    if (upperInstrumentType === 'FNO' || upperInstrumentType === 'INDEX') {
      if (!upperSymbol) {
        console.warn('F&O/INDEX requires symbol');
        return INDIAN_EQUITY_SPECS.DEFAULT;
      }
      return INDIAN_FNO_SPECS[upperSymbol] || {
        ...INDIAN_EQUITY_SPECS.DEFAULT,
        instrumentType: upperInstrumentType
      };
    }

    return INDIAN_EQUITY_SPECS.DEFAULT;
  }

  // Handle other markets (FOREX, COMMODITY, CRYPTO)
  const marketSpecs = CONTRACT_SPECS[upperMarket];
  if (!marketSpecs) {
    console.warn(`Unknown market type: ${market}`);
    return { contractSize: 1, lotType: LOT_TYPES.NONE, marketType: upperMarket };
  }

  if (!upperSymbol) {
    return marketSpecs.DEFAULT || { contractSize: 1, lotType: LOT_TYPES.FIXED, marketType: upperMarket };
  }

  return marketSpecs[upperSymbol] || marketSpecs.DEFAULT || { 
    contractSize: 1, 
    lotType: LOT_TYPES.FIXED, 
    marketType: upperMarket 
  };
};

/**
 * Get contract size for a given instrument
 * Simplified wrapper around getContractSpec for backward compatibility
 * 
 * @param {Object} params - Lookup parameters
 * @returns {number} Contract size (units per lot)
 */
export const getContractSize = (params) => {
  const spec = getContractSpec(params);
  return spec.contractSize || 1;
};

/**
 * Calculate position size (total units) from lot size
 * 
 * @param {Object} params - Calculation parameters
 * @param {string} params.market - Market type
 * @param {string} [params.symbol] - Trading symbol
 * @param {string} [params.instrumentType] - Instrument type (for Indian market)
 * @param {number} params.lotSize - Number of lots (or quantity for equity)
 * @returns {number} Total position size in units
 * 
 * @example
 * // Forex: 0.1 lots of EURUSD = 10,000 units
 * getPositionSize({ market: 'FOREX', symbol: 'EURUSD', lotSize: 0.1 })
 * // Returns: 10000
 * 
 * @example
 * // Indian F&O: 2 lots of NIFTY = 100 units (50 × 2)
 * getPositionSize({ market: 'INDIAN', symbol: 'NIFTY', instrumentType: 'INDEX', lotSize: 2 })
 * // Returns: 100
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
 * Validate lot size based on instrument specifications
 * 
 * @param {Object} params - Validation parameters
 * @param {string} params.market - Market type
 * @param {string} [params.symbol] - Trading symbol
 * @param {string} [params.instrumentType] - Instrument type
 * @param {number} params.lotSize - Lot size to validate
 * @returns {Object} Validation result { valid: boolean, message: string }
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

  // Check minimum lot size
  if (spec.minLotSize && lot < spec.minLotSize) {
    return { 
      valid: false, 
      message: `Minimum lot size is ${spec.minLotSize}` 
    };
  }

  // Check lot increment (e.g., 0.01 for forex)
  if (spec.lotIncrement) {
    const remainder = lot % spec.lotIncrement;
    if (remainder !== 0 && remainder > 0.000001) { // Allow for floating point precision
      return { 
        valid: false, 
        message: `Lot size must be in increments of ${spec.lotIncrement}` 
      };
    }
  }

  // For Indian FNO, lots must be whole numbers
  if (spec.marketType === MARKET_TYPES.INDIAN && 
      (spec.instrumentType === 'INDEX' || spec.instrumentType === 'FNO')) {
    if (lot !== Math.floor(lot)) {
      return { valid: false, message: 'Lots must be whole numbers for Indian F&O' };
    }
  }

  return { valid: true, message: 'Valid' };
};

/**
 * Get display label for lot/quantity field based on market
 * 
 * @param {Object} params - Parameters
 * @param {string} params.market - Market type
 * @param {string} [params.instrumentType] - Instrument type
 * @returns {string} Display label
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
 * 
 * @param {Object} params - Parameters
 * @returns {boolean} True if lot-based
 */
export const isLotBased = (params) => {
  const spec = getContractSpec(params);
  return spec.lotType !== LOT_TYPES.NONE;
};

/**
 * Export individual specifications for external use
 */
export {
  FOREX_SPECS,
  COMMODITY_SPECS,
  CRYPTO_SPECS,
  INDIAN_FNO_SPECS,
  INDIAN_EQUITY_SPECS
};
