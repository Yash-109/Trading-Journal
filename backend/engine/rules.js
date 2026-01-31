/**
 * Trade Rule Engine
 * Applies boolean rule checks using computed metrics
 * Each rule returns pass/fail with explanatory message
 */

import { EQUITY_RULE_CONFIG } from '../config/equity.rules.js';

/**
 * Rule: Stop loss must be set
 */
function checkStopLoss(metrics) {
  const passed = metrics.hasStopLoss;
  return {
    ruleId: 'STOP_LOSS',
    passed,
    message: passed
      ? 'Stop loss was set'
      : 'No stop loss was set - high risk exposure',
  };
}

/**
 * Rule: Risk per trade must not exceed threshold
 */
function checkRiskLimit(metrics) {
  const { riskPercent } = metrics;
  const maxRisk = EQUITY_RULE_CONFIG.thresholds.MAX_RISK_PERCENT;
  const passed = riskPercent <= maxRisk;

  return {
    ruleId: 'RISK_LIMIT',
    passed,
    message: passed
      ? `Risk ${riskPercent}% within limit`
      : `Risk ${riskPercent}% exceeds ${maxRisk}% limit`,
  };
}

/**
 * Rule: Risk-reward ratio must meet minimum threshold
 */
function checkRiskReward(metrics) {
  const { rrRatio } = metrics;
  const minRR = EQUITY_RULE_CONFIG.thresholds.MIN_RR_RATIO;
  const passed = rrRatio >= minRR;

  return {
    ruleId: 'RISK_REWARD',
    passed,
    message: passed
      ? `R:R ${rrRatio} meets minimum`
      : `R:R ${rrRatio} below ${minRR} minimum`,
  };
}

/**
 * Rule: Predefined trading rules must be followed
 */
function checkRuleFollowed(metrics) {
  const passed = metrics.ruleFollowed;
  return {
    ruleId: 'RULE_DISCIPLINE',
    passed,
    message: passed
      ? 'Trading rules were followed'
      : 'Trading rules were violated',
  };
}

/**
 * Evaluate all rules for a trade
 * @param {Object} metrics - Calculated trade metrics
 * @returns {Array} Array of rule results
 */
export function evaluateRules(metrics) {
  return [
    checkStopLoss(metrics),
    checkRiskLimit(metrics),
    checkRiskReward(metrics),
    checkRuleFollowed(metrics),
  ];
}
