/**
 * Trade Metrics Calculator
 * Computes pure factual metrics from raw trade data
 * No scoring, no weights - just objective measurements
 */

/**
 * Calculate all metrics for a single trade
 * @param {Object} trade - Raw trade object
 * @returns {Object} Computed metrics
 */
export function calculateMetrics(trade) {
  const {
    entryPrice,
    exitPrice,
    stopLoss,
    quantity,
    riskPercent,
    rrRatio,
    pnl,
    ruleFollowed,
  } = trade;

  return {
    // Risk management metrics
    hasStopLoss: stopLoss !== null && stopLoss !== undefined,
    riskPercent: riskPercent || 0,
    rrRatio: rrRatio || 0,

    // Trade outcome metrics
    pnl: pnl || 0,
    isProfitable: (pnl || 0) > 0,

    // Discipline metrics
    ruleFollowed: ruleFollowed === true,

    // Price metrics
    entryPrice: entryPrice || 0,
    exitPrice: exitPrice || 0,
    quantity: quantity || 0,
  };
}
