/**
 * ============================================================================
 * CENTRALIZED TRADE NORMALIZATION & ANALYTICS
 * ============================================================================
 * 
 * This module provides standardized trade data processing across ALL frontend
 * pages to ensure consistent analytics, calculations, and display.
 * 
 * PROBLEM IT SOLVES:
 * - Backend returns raw MongoDB data with field name: 'pnl'
 * - Frontend historically used: 'profitLoss'
 * - Some trades may have missing P/L that needs calculation
 * - Indian INDEX/FNO trades use lot-based quantity calculation
 * - Need consistent win/loss classification everywhere
 * - Analytics were calculated differently on each page
 * 
 * SOLUTION:
 * - Single source of truth for trade normalization
 * - Unified P/L calculation logic
 * - Lot-based quantity calculation for Indian markets
 * - Consistent numeric type safety
 * - Reusable across all pages
 * 
 * USAGE:
 * ```javascript
 * import { useTrades, useTradeStats } from '../hooks/useTrades';
 * 
 * const MyComponent = () => {
 *   const { trades: rawTrades } = useApp();
 *   const trades = useTrades(rawTrades);        // Normalized trades
 *   const stats = useTradeStats(trades);         // Aggregate statistics
 *   
 *   // Now use trades and stats - guaranteed consistent across all pages
 * };
 * ```
 * 
 * PAGES USING THIS:
 * - Dashboard.jsx  ✓
 * - Journal.jsx    ✓
 * - Analytics.jsx  ✓
 * 
 * ============================================================================
 */

/**
 * Custom hook for normalized trade data
 * Ensures consistent trade calculations across all pages
 * 
 * Handles:
 * - Field name mapping (backend pnl vs frontend profitLoss)
 * - Numeric type conversion
 * - Lot-based quantity for Indian INDEX/FNO
 * - P/L derivation from entry/exit/quantity/direction
 * - Win/Loss/Open classification
 */

import { useMemo } from 'react';

/**
 * Indian Index lot sizes (matching backend config)
 */
const INDEX_LOT_SIZES = {
  NIFTY: 25,
  BANKNIFTY: 15,
  FINNIFTY: 25,
  SENSEX: 10,
  MIDCPNIFTY: 50,
};

/**
 * Contract sizes for FOREX, COMMODITY, CRYPTO markets
 */
const CONTRACT_SIZES = {
  // Forex pairs (standard lot = 100,000 units)
  FOREX: {
    'EURUSD': 100000,
    'GBPUSD': 100000,
    'USDJPY': 100000,
    'USDCHF': 100000,
    'AUDUSD': 100000,
    'USDCAD': 100000,
    'NZDUSD': 100000,
    default: 100000
  },
  // Commodities
  COMMODITY: {
    'XAUUSD': 100,      // Gold: 100 ounces per lot
    'XAGUSD': 5000,     // Silver: 5000 ounces per lot
    default: 100
  },
  // Crypto
  CRYPTO: {
    'BTCUSD': 1,        // Bitcoin: 1 BTC per lot
    'ETHUSD': 1,        // Ethereum: 1 ETH per lot
    'BTCUSDT': 1,
    'ETHUSDT': 1,
    default: 1
  }
};

/**
 * Get lot size for Indian index
 */
const getLotSize = (symbol) => {
  if (!symbol) return 1;
  const upperSymbol = symbol.toUpperCase().trim();
  return INDEX_LOT_SIZES[upperSymbol] || 1;
};

/**
 * Get contract size for FOREX/COMMODITY/CRYPTO
 */
const getContractSize = (market, pair) => {
  if (!market || !pair) return 1;
  const upperPair = pair.toUpperCase().trim();
  
  if (market === 'FOREX') {
    return CONTRACT_SIZES.FOREX[upperPair] || CONTRACT_SIZES.FOREX.default;
  } else if (market === 'COMMODITY') {
    return CONTRACT_SIZES.COMMODITY[upperPair] || CONTRACT_SIZES.COMMODITY.default;
  } else if (market === 'CRYPTO') {
    return CONTRACT_SIZES.CRYPTO[upperPair] || CONTRACT_SIZES.CRYPTO.default;
  }
  
  return 1;
};

/**
 * Normalize a single trade object
 * @param {Object} trade - Raw trade from backend
 * @returns {Object} Normalized trade with calculated fields
 */
export const normalizeTrade = (trade) => {
  if (!trade) return null;

  // Parse all numeric fields safely
  const entry = parseFloat(trade.entry) || 0;
  const exit = parseFloat(trade.exit) || 0;
  const stopLoss = parseFloat(trade.stopLoss) || 0;
  const takeProfit = parseFloat(trade.takeProfit) || 0;
  const lotSize = parseFloat(trade.lotSize) || 0;
  const lots = parseFloat(trade.lots) || 0;
  const rr = parseFloat(trade.rr) || 0;
  const tradeQuality = parseInt(trade.tradeQuality) || 5;

  // Calculate actual quantity for Indian markets
  let actualQuantity = parseFloat(trade.quantity) || 0;
  if (trade.market === 'INDIAN' && (trade.instrumentType === 'INDEX' || trade.instrumentType === 'FNO') && lots > 0) {
    const lotSizeForSymbol = getLotSize(trade.symbol);
    actualQuantity = lots * lotSizeForSymbol;
  }

  // Get P/L from either backend field (pnl) or frontend field (profitLoss)
  let pnl = parseFloat(trade.pnl) || parseFloat(trade.profitLoss) || 0;

  // Derive P/L from price data if missing and we have required fields
  if (pnl === 0 && entry && exit) {
    const direction = (trade.direction || '').toLowerCase();
    
    if (trade.market === 'INDIAN' && actualQuantity > 0) {
      // Indian market: quantity-based (from lots)
      if (direction === 'buy') {
        pnl = (exit - entry) * actualQuantity;
      } else if (direction === 'sell') {
        pnl = (entry - exit) * actualQuantity;
      }
    } else if (lotSize > 0 && (trade.market === 'FOREX' || trade.market === 'CRYPTO' || trade.market === 'COMMODITY')) {
      // FOREX/CRYPTO/COMMODITY: lot-based with contract size
      const contractSize = getContractSize(trade.market, trade.pair);
      
      if (direction === 'buy') {
        pnl = (exit - entry) * contractSize * lotSize;
      } else if (direction === 'sell') {
        pnl = (entry - exit) * contractSize * lotSize;
      }
    }
  }

  // Classify trade result
  const isWin = pnl > 0;
  const isLoss = pnl < 0;
  const isBreakeven = pnl === 0 && exit > 0; // Has exit price but no P/L
  const isOpen = exit === 0; // No exit price yet

  // Normalize display field: INDIAN trades use symbol, others use pair
  const displayPair = trade.market === 'INDIAN' ? (trade.symbol || '') : (trade.pair || '');

  return {
    ...trade,
    // Normalized numeric fields
    entry,
    exit,
    stopLoss,
    takeProfit,
    lotSize,
    pnl,
    rr,
    tradeQuality,
    // Classification flags
    isWin,
    isLoss,
    isBreakeven,
    isOpen,
    // Display field for UI
    displayPair,
  };
};

/**
 * Custom hook to get normalized trades
 * @param {Array} rawTrades - Raw trades from AppContext
 * @returns {Array} Normalized trades with calculated fields
 */
export const useTrades = (rawTrades = []) => {
  return useMemo(() => {
    if (!rawTrades || rawTrades.length === 0) {
      return [];
    }

    return rawTrades.map(normalizeTrade).filter(Boolean);
  }, [rawTrades]);
};

/**
 * Calculate aggregate statistics from normalized trades
 * @param {Array} normalizedTrades - Trades from useTrades hook
 * @returns {Object} Aggregate statistics
 */
export const useTradeStats = (normalizedTrades = []) => {
  return useMemo(() => {
    if (!normalizedTrades || normalizedTrades.length === 0) {
      return {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        breakevenTrades: 0,
        openTrades: 0,
        totalPnL: 0,
        bestTrade: 0,
        worstTrade: 0,
        avgPnL: 0,
        winRate: 0,
        avgRR: 0,
        consistencyScore: 0,
        currentStreak: 0,
        streakType: 'none',
      };
    }

    // Filter by trade result
    const winningTrades = normalizedTrades.filter(t => t.isWin);
    const losingTrades = normalizedTrades.filter(t => t.isLoss);
    const breakevenTrades = normalizedTrades.filter(t => t.isBreakeven);
    const openTrades = normalizedTrades.filter(t => t.isOpen);
    const closedTrades = normalizedTrades.filter(t => !t.isOpen);

    // Calculate totals (only from closed trades)
    const totalPnL = closedTrades.reduce((sum, t) => sum + t.pnl, 0);
    
    // Best and worst trades (guard against empty arrays)
    const pnlValues = closedTrades.map(t => t.pnl);
    const bestTrade = pnlValues.length > 0 ? Math.max(...pnlValues) : 0;
    const worstTrade = pnlValues.length > 0 ? Math.min(...pnlValues) : 0;
    
    // Average P/L (only from closed trades)
    const avgPnL = closedTrades.length > 0 ? totalPnL / closedTrades.length : 0;
    
    // Win rate (only from closed trades)
    const winRate = closedTrades.length > 0 
      ? (winningTrades.length / closedTrades.length) * 100 
      : 0;
    
    // Average Risk:Reward
    const avgRR = normalizedTrades.reduce((sum, t) => sum + t.rr, 0) / normalizedTrades.length;
    
    // Consistency score (percentage of trades where rules were followed)
    const rulesFollowedCount = normalizedTrades.filter(t => t.ruleFollowed).length;
    const consistencyScore = (rulesFollowedCount / normalizedTrades.length) * 100;

    // Calculate current win/loss streak
    const sortedTrades = [...closedTrades].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    let currentStreak = 0;
    let streakType = 'none';
    
    if (sortedTrades.length > 0) {
      const isWinStreak = sortedTrades[0].isWin;
      streakType = isWinStreak ? 'win' : 'loss';
      
      for (const trade of sortedTrades) {
        if ((isWinStreak && trade.isWin) || (!isWinStreak && trade.isLoss)) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    return {
      totalTrades: normalizedTrades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      breakevenTrades: breakevenTrades.length,
      openTrades: openTrades.length,
      totalPnL,
      bestTrade,
      worstTrade,
      avgPnL,
      winRate,
      avgRR,
      consistencyScore,
      currentStreak,
      streakType,
    };
  }, [normalizedTrades]);
};

export default useTrades;
