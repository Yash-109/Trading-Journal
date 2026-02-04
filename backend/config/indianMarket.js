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
