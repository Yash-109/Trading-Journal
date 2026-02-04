/**
 * Currency Formatting Utilities
 * Market-aware currency formatting for P&L display
 * 
 * Indian markets: ₹ (INR)
 * Forex/Crypto: $ (USD)
 */

/**
 * Get currency symbol based on market type
 * @param {string} market - Market type: 'INDIAN', 'FOREX', 'CRYPTO'
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (market) => {
  if (market === 'INDIAN') {
    return '₹';
  }
  return '$'; // Default for FOREX and CRYPTO
};

/**
 * Get currency code based on market type
 * @param {string} market - Market type: 'INDIAN', 'FOREX', 'CRYPTO'
 * @returns {string} Currency code
 */
export const getCurrencyCode = (market) => {
  if (market === 'INDIAN') {
    return 'INR';
  }
  return 'USD'; // Default for FOREX and CRYPTO
};

/**
 * Format P&L value with market-appropriate currency symbol
 * @param {number} value - P&L amount
 * @param {string} market - Market type: 'INDIAN', 'FOREX', 'CRYPTO'
 * @param {boolean} showSign - Whether to show + for positive values
 * @returns {string} Formatted P&L string
 */
export const formatPnL = (value, market = 'FOREX', showSign = true) => {
  const num = parseFloat(value) || 0;
  const symbol = getCurrencySymbol(market);
  const sign = showSign && num > 0 ? '+' : '';
  
  return `${sign}${symbol}${Math.abs(num).toFixed(2)}${num < 0 ? '' : ''}`.replace('₹-', '-₹').replace('$-', '-$');
};

/**
 * Format P&L with proper sign handling
 * Returns formatted string like: +₹1250.00, -₹500.00, +$125.50, -$50.00
 * @param {number} value - P&L amount
 * @param {string} market - Market type
 * @returns {string} Properly formatted P&L
 */
export const formatPnLWithSign = (value, market = 'FOREX') => {
  const num = parseFloat(value) || 0;
  const symbol = getCurrencySymbol(market);
  const absValue = Math.abs(num).toFixed(2);
  
  if (num >= 0) {
    return `+${symbol}${absValue}`;
  } else {
    return `-${symbol}${absValue}`;
  }
};

/**
 * Format currency value without sign
 * @param {number} value - Amount
 * @param {string} market - Market type
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, market = 'FOREX') => {
  const num = parseFloat(value) || 0;
  const symbol = getCurrencySymbol(market);
  
  return `${symbol}${Math.abs(num).toFixed(2)}`;
};

/**
 * Get color class based on P&L value
 * @param {number} value - P&L amount
 * @returns {string} Tailwind color class
 */
export const getPnLColorClass = (value) => {
  const num = parseFloat(value) || 0;
  return num >= 0 ? 'text-profit' : 'text-loss';
};
