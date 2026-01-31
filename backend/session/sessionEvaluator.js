/**
 * Session Evaluator - Main Orchestrator
 * Evaluates multiple trades and aggregates into session-level verdict
 * Pipeline: Trades → Trade Evaluations → Session Metrics → Session Verdict
 */

import { evaluateTrade } from '../engine/evaluator.js';
import { aggregateSessionMetrics } from './sessionMetrics.js';

// Session verdict thresholds
const SESSION_VERDICT_THRESHOLDS = {
  GOOD: 80,
  AVERAGE: 60,
};

/**
 * Determine session verdict based on consistency score
 * @param {number} consistencyScore - Session consistency score (0-100)
 * @returns {string} Session verdict: "GOOD", "AVERAGE", or "BAD"
 */
function determineSessionVerdict(consistencyScore) {
  if (consistencyScore >= SESSION_VERDICT_THRESHOLDS.GOOD) {
    return 'GOOD';
  }

  if (consistencyScore >= SESSION_VERDICT_THRESHOLDS.AVERAGE) {
    return 'AVERAGE';
  }

  return 'BAD';
}

/**
 * Return a safe empty session result
 * Used when no valid trades exist
 * @returns {Object} Empty session result
 */
function getEmptySessionResult() {
  return {
    totalTrades: 0,
    verdictCounts: { GOOD: 0, AVERAGE: 0, BAD: 0 },
    verdictPercentages: { GOOD: 0, AVERAGE: 0, BAD: 0 },
    consistencyScore: 0,
    sessionVerdict: 'BAD', // No trades = bad session
    dominantFailureReasons: [],
    tradeEvaluations: [],
  };
}

/**
 * Evaluate a trading session (multiple trades)
 * @param {Array} trades - Array of trade objects
 * @returns {Object} Complete session evaluation result
 */
export function evaluateSession(trades) {
  // Validate input - must be an array
  if (!Array.isArray(trades)) {
    throw new Error('Invalid input: trades must be an array');
  }

  // Handle empty array early
  if (trades.length === 0) {
    return getEmptySessionResult();
  }

  // Step 1: Evaluate each individual trade with robust error handling
  const tradeEvaluations = [];
  
  for (const trade of trades) {
    try {
      // Skip null/undefined trades
      if (!trade) {
        continue;
      }
      
      const evaluation = evaluateTrade(trade);
      tradeEvaluations.push(evaluation);
    } catch (error) {
      // Log error but continue processing remaining trades
      const tradeId = trade?.tradeId || 'unknown';
      console.error(`Failed to evaluate trade ${tradeId}:`, error.message);
      // Continue to next trade
    }
  }

  // Handle case where all trades failed evaluation
  if (tradeEvaluations.length === 0) {
    return getEmptySessionResult();
  }

  // Step 2: Aggregate trade evaluations into session metrics
  const sessionMetrics = aggregateSessionMetrics(tradeEvaluations);

  // Step 3: Determine overall session verdict
  const sessionVerdict = determineSessionVerdict(sessionMetrics.consistencyScore);

  // Return complete session evaluation
  return {
    totalTrades: sessionMetrics.totalTrades,
    verdictCounts: sessionMetrics.verdictCounts,
    verdictPercentages: sessionMetrics.verdictPercentages,
    consistencyScore: sessionMetrics.consistencyScore,
    sessionVerdict,
    dominantFailureReasons: sessionMetrics.dominantFailureReasons,
    tradeEvaluations,
  };
}
