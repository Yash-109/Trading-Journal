/**
 * Trade Metrics Calculator
 * Computes pure factual metrics from raw trade data
 * No scoring, no weights - just objective measurements
 */

/**
 * Safely convert value to number, handling edge cases
 * @param {*} value - Value to convert
 * @param {number} defaultValue - Default if invalid
 * @returns {number} Valid number
 */
function safeNumber(value, defaultValue = 0) {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  const num = Number(value);
  return isNaN(num) || !isFinite(num) ? defaultValue : num;
}

/**
 * Validate if stop loss makes sense for the trade direction
 * For long trades: stopLoss should be < entryPrice
 * @param {number} stopLoss - Stop loss price
 * @param {number} entryPrice - Entry price
 * @param {number} exitPrice - Exit price
 * @returns {boolean} True if valid or indeterminate
 */
function isStopLossValid(stopLoss, entryPrice, exitPrice) {
  // If any price is invalid, can't determine validity - assume invalid
  if (!entryPrice || !stopLoss) {
    return false;
  }

  // Determine trade direction from entry/exit
  const isLongTrade = exitPrice >= entryPrice;
  
  // For long trades, stop loss must be below entry
  // For short trades, stop loss must be above entry
  if (isLongTrade) {
    return stopLoss < entryPrice;
  } else {
    return stopLoss > entryPrice;
  }
}

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

  // Safely extract numeric values with validation
  const safeEntryPrice = safeNumber(entryPrice);
  const safeExitPrice = safeNumber(exitPrice);
  const safeStopLoss = safeNumber(stopLoss);
  const safeRiskPercent = safeNumber(riskPercent);
  const safeRRRatio = safeNumber(rrRatio);
  const safePnl = safeNumber(pnl);
  const safeQuantity = safeNumber(quantity);

  // Validate stop loss existence and correctness
  const stopLossExists = stopLoss !== null && stopLoss !== undefined;
  const stopLossIsValid = stopLossExists && isStopLossValid(safeStopLoss, safeEntryPrice, safeExitPrice);

  // Handle negative or extreme risk values - clamp to reasonable range
  const normalizedRiskPercent = Math.max(0, Math.min(safeRiskPercent, 100));

  // Handle zero or negative RR ratio - treat as 0
  const normalizedRRRatio = Math.max(0, safeRRRatio);

  return {
    // Risk management metrics
    hasStopLoss: stopLossIsValid, // Only true if stop loss exists AND is valid
    riskPercent: normalizedRiskPercent,
    rrRatio: normalizedRRRatio,

    // Trade outcome metrics
    pnl: safePnl,
    isProfitable: safePnl > 0, // Breakeven (pnl=0) is NOT profitable

    // Discipline metrics
    ruleFollowed: ruleFollowed === true, // Explicit true check, missing = false

    // Price metrics
    entryPrice: safeEntryPrice,
    exitPrice: safeExitPrice,
    quantity: safeQuantity,
  };
}
