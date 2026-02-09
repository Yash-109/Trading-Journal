/**
 * Indian Market Configuration
 * Official NSE lot sizes for Index F&O instruments
 * 
 * Source: NSE India official specifications
 * Last updated: February 2026
 * 
 * NOTE: These lot sizes are as per NSE specifications and may change.
 * Always verify with NSE official circulars for the most current lot sizes.
 */

/**
 * Lot sizes for Indian Index F&O instruments
 * Key: Index symbol (uppercase)
 * Value: Number of units per lot
 */
export const INDEX_LOT_SIZES = {
  // NIFTY 50 Index F&O
  NIFTY: 25,          // 25 units per lot (as of recent NSE specification)
  
  // BANK NIFTY Index F&O
  BANKNIFTY: 15,      // 15 units per lot (as of recent NSE specification)
  
  // FINNIFTY (Financial Services Index) F&O
  FINNIFTY: 25,       // 25 units per lot (as of recent NSE specification)
  
  // SENSEX (BSE Index) F&O
  SENSEX: 10,         // 10 units per lot (BSE specification)
  
  // MIDCAP NIFTY Index F&O
  MIDCPNIFTY: 50,     // 50 units per lot
  
  // Default fallback for unknown indices
  DEFAULT: 1,
};

/**
 * Get lot size for a given index symbol
 * @param {string} symbol - Index symbol (e.g., 'NIFTY', 'BANKNIFTY')
 * @returns {number} Lot size for the index
 */
export const getLotSize = (symbol) => {
  if (!symbol) return INDEX_LOT_SIZES.DEFAULT;
  
  const upperSymbol = symbol.toUpperCase().trim();
  return INDEX_LOT_SIZES[upperSymbol] || INDEX_LOT_SIZES.DEFAULT;
};

/**
 * Calculate actual quantity from lots
 * @param {string} symbol - Index symbol
 * @param {number} lots - Number of lots
 * @returns {number} Actual quantity (lots × lot size)
 */
export const calculateQuantityFromLots = (symbol, lots) => {
  const lotSize = getLotSize(symbol);
  const numLots = parseFloat(lots) || 0;
  return numLots * lotSize;
};

/**
 * Check if a symbol is a supported Indian index
 * @param {string} symbol - Symbol to check
 * @returns {boolean} True if it's a recognized index
 */
export const isSupportedIndex = (symbol) => {
  if (!symbol) return false;
  const upperSymbol = symbol.toUpperCase().trim();
  return Object.keys(INDEX_LOT_SIZES).includes(upperSymbol) && upperSymbol !== 'DEFAULT';
};

/**
 * Indian market trading session information
 * Fixed timing - no multiple sessions like forex
 */
export const INDIAN_MARKET_SESSION = {
  name: 'Indian Market Hours',
  start: '09:15',  // 9:15 AM IST
  end: '15:30',    // 3:30 PM IST
  timezone: 'Asia/Kolkata',
  description: 'Indian equity and F&O markets operate during fixed hours',
};

/**
 * Indian market currency
 */
export const INDIAN_MARKET_CURRENCY = {
  code: 'INR',
  symbol: '₹',
  name: 'Indian Rupee',
};

/**
 * Contract sizes for FOREX, COMMODITY, and CRYPTO markets
 * These define how many units are in one standard lot
 */
export const CONTRACT_SIZES = {
  // FOREX pairs (standard lot = 100,000 units of base currency)
  FOREX: {
    'EURUSD': 100000,
    'GBPUSD': 100000,
    'USDJPY': 100000,
    'USDCHF': 100000,
    'AUDUSD': 100000,
    'USDCAD': 100000,
    'NZDUSD': 100000,
    DEFAULT: 100000
  },
  // COMMODITY contracts
  COMMODITY: {
    'XAUUSD': 100,      // Gold: 100 troy ounces per lot ($1 move = $100 per lot)
    'XAGUSD': 5000,     // Silver: 5000 troy ounces per lot
    DEFAULT: 100
  },
  // CRYPTO contracts
  CRYPTO: {
    'BTCUSD': 1,        // Bitcoin: 1 BTC per lot
    'ETHUSD': 1,        // Ethereum: 1 ETH per lot
    'BTCUSDT': 1,
    'ETHUSDT': 1,
    DEFAULT: 1
  }
};

/**
 * Get contract size for a given market and pair/symbol
 * @param {string} market - Market type ('FOREX', 'COMMODITY', 'CRYPTO')
 * @param {string} pair - Trading pair/symbol (e.g., 'EURUSD', 'XAUUSD', 'BTCUSD')
 * @returns {number} Contract size (units per lot)
 */
export const getContractSize = (market, pair) => {
  if (!market || !pair) return 1;
  
  const upperMarket = market.toUpperCase();
  const upperPair = pair.toUpperCase().trim();
  
  if (upperMarket === 'FOREX') {
    return CONTRACT_SIZES.FOREX[upperPair] || CONTRACT_SIZES.FOREX.DEFAULT;
  } else if (upperMarket === 'COMMODITY') {
    return CONTRACT_SIZES.COMMODITY[upperPair] || CONTRACT_SIZES.COMMODITY.DEFAULT;
  } else if (upperMarket === 'CRYPTO') {
    return CONTRACT_SIZES.CRYPTO[upperPair] || CONTRACT_SIZES.CRYPTO.DEFAULT;
  }
  
  return 1;
};
