/**
 * Frontend Currency Converter
 * Converts P&L between currencies using stored exchange rates
 * 
 * IMPORTANT: Always uses exchangeRateAtExecution from trade
 * Never recalculates historical rates
 */

/**
 * Convert P&L to account currency
 * @param {number} pnl - Native P&L amount
 * @param {string} tradeCurrency - Currency of the trade ('USD' or 'INR')
 * @param {string} accountCurrency - User's selected account currency
 * @param {number} exchangeRateAtExecution - Exchange rate when trade was executed
 * @returns {number} Converted P&L
 */
export function convertToAccountCurrency(
  pnl,
  tradeCurrency,
  accountCurrency,
  exchangeRateAtExecution
) {
  // Validate inputs
  if (typeof pnl !== 'number' || isNaN(pnl)) {
    return 0;
  }

  // No conversion needed if currencies match
  if (tradeCurrency === accountCurrency) {
    return pnl;
  }

  // Ensure valid exchange rate
  const rate = exchangeRateAtExecution || 1;

  // USD to INR
  if (tradeCurrency === 'USD' && accountCurrency === 'INR') {
    return pnl * rate;
  }

  // INR to USD
  if (tradeCurrency === 'INR' && accountCurrency === 'USD') {
    return pnl / rate;
  }

  // Fallback: return original
  return pnl;
}

/**
 * Convert array of trades to account currency
 * Adds convertedPnl field to each trade
 * @param {Array} trades - Array of trade objects
 * @param {string} accountCurrency - Target currency
 * @returns {Array} Trades with convertedPnl field
 */
export function convertTradesArray(trades, accountCurrency) {
  if (!Array.isArray(trades)) {
    return [];
  }

  return trades.map(trade => ({
    ...trade,
    convertedPnl: convertToAccountCurrency(
      trade.pnl || 0,
      trade.tradeCurrency || 'USD', // fallback for old trades
      accountCurrency,
      trade.exchangeRateAtExecution || 1
    )
  }));
}

/**
 * Aggregate total P&L in account currency
 * @param {Array} trades - Array of trade objects
 * @param {string} accountCurrency - Target currency
 * @returns {number} Total P&L in account currency
 */
export function getTotalPnL(trades, accountCurrency) {
  if (!Array.isArray(trades) || trades.length === 0) {
    return 0;
  }

  return trades.reduce((total, trade) => {
    const convertedPnl = convertToAccountCurrency(
      trade.pnl || 0,
      trade.tradeCurrency || 'USD',
      accountCurrency,
      trade.exchangeRateAtExecution || 1
    );
    return total + convertedPnl;
  }, 0);
}

/**
 * Get wins and losses count after currency conversion
 * @param {Array} trades - Array of trade objects
 * @param {string} accountCurrency - Target currency
 * @returns {Object} { wins, losses, winRate }
 */
export function getWinLossStats(trades, accountCurrency) {
  if (!Array.isArray(trades) || trades.length === 0) {
    return { wins: 0, losses: 0, winRate: 0 };
  }

  const convertedTrades = convertTradesArray(trades, accountCurrency);
  
  const wins = convertedTrades.filter(t => t.convertedPnl > 0).length;
  const losses = convertedTrades.filter(t => t.convertedPnl < 0).length;
  const totalTrades = wins + losses;
  const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;

  return { wins, losses, winRate };
}
