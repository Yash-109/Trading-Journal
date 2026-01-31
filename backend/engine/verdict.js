/**
 * Trade Verdict Engine
 * Maps numerical score to qualitative verdict
 * Verdict categories: GOOD | AVERAGE | BAD
 */

import { EQUITY_RULE_CONFIG } from '../config/equity.rules.js';

/**
 * Determine verdict based on score
 * @param {number} score - Trade score (0-100)
 * @returns {string} Verdict: "GOOD", "AVERAGE", or "BAD"
 */
export function determineVerdict(score) {
  if (score >= EQUITY_RULE_CONFIG.verdicts.GOOD) {
    return 'GOOD';
  }

  if (score >= EQUITY_RULE_CONFIG.verdicts.AVERAGE) {
    return 'AVERAGE';
  }

  return 'BAD';
}

/**
 * Get descriptive message for verdict
 * @param {string} verdict - Trade verdict
 * @returns {string} Human-readable description
 */
export function getVerdictDescription(verdict) {
  const descriptions = {
    GOOD: 'Well-executed trade following risk management rules',
    AVERAGE: 'Acceptable trade with minor rule violations',
    BAD: 'Poor trade execution with significant rule violations',
  };

  return descriptions[verdict] || 'Unknown verdict';
}
