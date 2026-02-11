/**
 * Determines the trade currency based on trading pair, market, and symbol
 * 
 * @param {Object} tradeData - Trade information
 * @param {string} tradeData.pair - Trading pair (e.g., 'XAUUSD', 'BTCUSD')
 * @param {string} tradeData.market - Market type ('FOREX', 'CRYPTO', 'COMMODITY', 'INDIAN')
 * @param {string} tradeData.symbol - Symbol for Indian market (e.g., 'NIFTY', 'SENSEX')
 * @returns {string} Currency code ('USD' or 'INR')
 */
function getTradeCurrencyFromPair(tradeData) {
  const { pair, market, symbol } = tradeData;

  // Indian market trades are always in INR
  if (market === 'INDIAN') {
    return 'INR';
  }

  // NSE-listed symbols (even if not explicitly marked as INDIAN market)
  if (symbol) {
    const indianSymbols = ['NIFTY', 'BANKNIFTY', 'FINNIFTY', 'SENSEX', 'BANKEX'];
    const upperSymbol = symbol.toUpperCase();
    
    if (indianSymbols.some(s => upperSymbol.includes(s))) {
      return 'INR';
    }
  }

  // Check pair suffix for INR
  if (pair) {
    const upperPair = pair.toUpperCase().replace(/[\/\s-]/g, '');
    
    // If pair ends with INR (e.g., USD/INR, USDINR)
    if (upperPair.endsWith('INR')) {
      return 'INR';
    }
  }

  // Default: FOREX, CRYPTO, COMMODITY are USD-based
  return 'USD';
}

export { getTradeCurrencyFromPair };
