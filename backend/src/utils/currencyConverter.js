/**
 * Currency Converter Utility
 * Converts P&L between USD and INR using stored exchange rates
 * 
 * RULES:
 * - Always use exchangeRateAtExecution stored in trade
 * - Never recalculate historical rates
 * - Never make API calls here
 */

/**
 * Convert P&L to account currency
 * 
 * @param {number} pnl - Native P&L amount
 * @param {string} tradeCurrency - Currency of the trade ('USD' or 'INR')
 * @param {string} accountCurrency - User's selected account currency ('USD' or 'INR') 
 * @param {number} exchangeRateAtExecution - Exchange rate when trade was executed
 * @returns {number} Converted P&L in account currency
 */
function convertToAccountCurrency(
  pnl,
  tradeCurrency,
  accountCurrency,
  exchangeRateAtExecution
) {
  // Validate inputs
  if (typeof pnl !== 'number' || isNaN(pnl)) {
    return 0;
  }

  // No conversion needed if currencies are the same
  if (tradeCurrency === accountCurrency) {
    return pnl;
  }

  // Ensure we have a valid exchange rate - NO SILENT FALLBACK
  if (!exchangeRateAtExecution || exchangeRateAtExecution <= 0 || isNaN(exchangeRateAtExecution)) {
    console.error(
      `Invalid exchange rate (${exchangeRateAtExecution}) for conversion: ${tradeCurrency} -> ${accountCurrency}. ` +
      'Trade will display in original currency.'
    );
    return pnl; // Return original instead of converting with invalid rate
  }

  // USD trade displayed in INR
  if (tradeCurrency === 'USD' && accountCurrency === 'INR') {
    return pnl * exchangeRateAtExecution;
  }

  // INR trade displayed in USD
  if (tradeCurrency === 'INR' && accountCurrency === 'USD') {
    return pnl / exchangeRateAtExecution;
  }

  // Fallback: return original P&L
  console.warn(
    `Unhandled currency conversion: ${tradeCurrency} -> ${accountCurrency}`
  );
  return pnl;
}

/**
 * Batch convert trades to account currency
 * @param {Array} trades - Array of trade objects
 * @param {string} accountCurrency - Target account currency
 * @returns {Array} Trades with convertedPnl field added
 */
function convertTradesArray(trades, accountCurrency) {
  if (!Array.isArray(trades)) {
    return [];
  }

  return trades.map(trade => ({
    ...trade,
    convertedPnl: convertToAccountCurrency(
      trade.pnl,
      trade.tradeCurrency || 'USD', // fallback for old trades
      accountCurrency,
      trade.exchangeRateAtExecution // Let converter handle invalid rates
    )
  }));
}

export { convertToAccountCurrency, convertTradesArray };
