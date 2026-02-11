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
  // Guard: Handle null, undefined, NaN, or non-numeric pnl
  if (!pnl || typeof pnl !== 'number' || isNaN(pnl) || !isFinite(pnl)) {
    return 0;
  }

  // Guard: Ensure we have valid currencies
  if (!tradeCurrency || !accountCurrency) {
    return pnl;
  }

  // No conversion needed if currencies match
  if (tradeCurrency === accountCurrency) {
    return pnl;
  }

  // Guard: Ensure valid exchange rate (must be positive number)
  if (!exchangeRateAtExecution || exchangeRateAtExecution <= 0 || isNaN(exchangeRateAtExecution) || !isFinite(exchangeRateAtExecution)) {
    exchangeRateAtExecution = 1;
  }

  // USD to INR
  if (tradeCurrency === 'USD' && accountCurrency === 'INR') {
    const result = pnl * exchangeRateAtExecution;
    return isFinite(result) ? result : pnl;
  }

  // INR to USD
  if (tradeCurrency === 'INR' && accountCurrency === 'USD') {
    const result = pnl / exchangeRateAtExecution;
    return isFinite(result) ? result : pnl;
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
  // Guard: Ensure we have an array
  if (!Array.isArray(trades)) {
    return [];
  }

  // Guard: Ensure we have a valid account currency
  const safeCurrency = accountCurrency || 'USD';

  // Defensively normalize each trade before conversion
  return trades.map(trade => {
    // Guard: Skip null/undefined trades
    if (!trade) return null;

    // Normalize trade data with safe defaults
    const safeTrade = {
      ...trade,
      pnl: Number(trade?.pnl) || 0,
      tradeCurrency: trade?.tradeCurrency || safeCurrency || 'USD',
      exchangeRateAtExecution: Number(trade?.exchangeRateAtExecution) || 1
    };

    // Convert P&L to account currency
    const convertedPnl = convertToAccountCurrency(
      safeTrade.pnl,
      safeTrade.tradeCurrency,
      safeCurrency,
      safeTrade.exchangeRateAtExecution
    );

    return {
      ...safeTrade,
      convertedPnl: Number(convertedPnl) || 0  // Ensure numeric result
    };
  }).filter(Boolean);  // Remove any null trades
}

/**
 * Aggregate total P&L in account currency
 * @param {Array} trades - Array of trade objects
 * @param {string} accountCurrency - Target currency
 * @returns {number} Total P&L in account currency
 */
export function getTotalPnL(trades, accountCurrency) {
  // Guard: Handle invalid inputs
  if (!Array.isArray(trades) || trades.length === 0) {
    return 0;
  }

  // Guard: Ensure valid currency
  const safeCurrency = accountCurrency || 'USD';

  const total = trades.reduce((sum, trade) => {
    // Guard: Skip null/undefined trades
    if (!trade) return sum;

    const convertedPnl = convertToAccountCurrency(
      Number(trade?.pnl) || 0,
      trade?.tradeCurrency || 'USD',
      safeCurrency,
      Number(trade?.exchangeRateAtExecution) || 1
    );
    
    // Guard: Ensure we're adding a valid number
    const safeValue = Number(convertedPnl) || 0;
    return sum + (isFinite(safeValue) ? safeValue : 0);
  }, 0);

  // Guard: Return safe numeric value
  return Number(total) || 0;
}

/**
 * Get wins and losses count after currency conversion
 * @param {Array} trades - Array of trade objects
 * @param {string} accountCurrency - Target currency
 * @returns {Object} { wins, losses, winRate }
 */
export function getWinLossStats(trades, accountCurrency) {
  // Guard: Handle invalid inputs
  if (!Array.isArray(trades) || trades.length === 0) {
    return { wins: 0, losses: 0, winRate: 0 };
  }

  // Convert trades safely
  const convertedTrades = convertTradesArray(trades, accountCurrency);
  
  // Guard: Handle empty conversion result
  if (!convertedTrades || convertedTrades.length === 0) {
    return { wins: 0, losses: 0, winRate: 0 };
  }

  // Safe filtering with defensive checks
  const wins = convertedTrades.filter(t => t && Number(t.convertedPnl) > 0).length;
  const losses = convertedTrades.filter(t => t && Number(t.convertedPnl) < 0).length;
  const totalTrades = wins + losses;
  
  // Guard: Prevent division by zero
  const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;

  return { 
    wins, 
    losses, 
    winRate: Number(winRate) || 0 
  };
}
