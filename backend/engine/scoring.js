/**
 * Trade Scoring Engine
 * Calculates numerical score by applying penalties for failed rules
 * Score range: 0-100
 */

import { EQUITY_RULE_CONFIG } from '../config/equity.rules.js';

/**
 * Map rule IDs to their penalty values
 */
const RULE_PENALTY_MAP = {
  STOP_LOSS: EQUITY_RULE_CONFIG.penalties.NO_STOP_LOSS,
  RISK_LIMIT: EQUITY_RULE_CONFIG.penalties.HIGH_RISK,
  RISK_REWARD: EQUITY_RULE_CONFIG.penalties.LOW_RR,
  RULE_DISCIPLINE: EQUITY_RULE_CONFIG.penalties.RULE_BROKEN,
};

/**
 * Calculate trade score based on rule results
 * @param {Array} ruleResults - Array of rule evaluation results
 * @returns {number} Final score (0-100)
 */
export function calculateScore(ruleResults) {
  // Guard against invalid input
  if (!Array.isArray(ruleResults) || ruleResults.length === 0) {
    return EQUITY_RULE_CONFIG.baseScore; // No rules = perfect score
  }

  let score = EQUITY_RULE_CONFIG.baseScore;

  // Deduct penalties for each failed rule
  for (const rule of ruleResults) {
    if (rule && rule.passed === false) { // Explicit false check
      const penalty = RULE_PENALTY_MAP[rule.ruleId] || 0;
      score -= penalty;
    }
  }

  // Clamp score between 0 and 100 (safety net)
  return Math.max(0, Math.min(100, score));
}

/**
 * Get list of reasons why points were deducted
 * @param {Array} ruleResults - Array of rule evaluation results
 * @returns {Array} Array of penalty reasons
 */
export function getPenaltyReasons(ruleResults) {
  return ruleResults
    .filter((rule) => !rule.passed)
    .map((rule) => ({
      ruleId: rule.ruleId,
      penalty: RULE_PENALTY_MAP[rule.ruleId] || 0,
      message: rule.message,
    }));
}
