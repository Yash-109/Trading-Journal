/**
 * Trade Evaluator - Main Orchestrator
 * Coordinates the entire trade evaluation pipeline:
 * Trade → Metrics → Rules → Score → Verdict
 */

import { calculateMetrics } from './metrics.js';
import { evaluateRules } from './rules.js';
import { calculateScore, getPenaltyReasons } from './scoring.js';
import { determineVerdict, getVerdictDescription } from './verdict.js';

/**
 * Validate if a trade object has minimum required fields
 * @param {Object} trade - Trade object to validate
 * @returns {boolean} True if valid
 */
function isValidTrade(trade) {
  if (!trade || typeof trade !== 'object') {
    return false;
  }
  
  // tradeId is required and must be non-empty
  if (!trade.tradeId || (typeof trade.tradeId === 'string' && trade.tradeId.trim() === '')) {
    return false;
  }
  
  return true;
}

/**
 * Evaluate a single trade through the complete pipeline
 * @param {Object} trade - Trade object with all required fields
 * @returns {Object} Complete evaluation result
 */
export function evaluateTrade(trade) {
  // Validate input - throw error for truly invalid trades
  if (!isValidTrade(trade)) {
    throw new Error('Invalid trade object: tradeId is required');
  }

  // Step 1: Calculate pure metrics
  const metrics = calculateMetrics(trade);

  // Step 2: Apply rule checks
  const ruleResults = evaluateRules(metrics);

  // Step 3: Calculate numerical score
  const score = calculateScore(ruleResults);

  // Step 4: Determine qualitative verdict
  const verdict = determineVerdict(score);

  // Step 5: Compile penalty reasons
  const reasons = getPenaltyReasons(ruleResults);

  // Return complete evaluation
  return {
    tradeId: trade.tradeId,
    metrics,
    ruleResults,
    score,
    verdict,
    verdictDescription: getVerdictDescription(verdict),
    reasons,
  };
}
