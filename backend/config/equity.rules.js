/**
 * Equity Trading Rules Configuration
 * Centralized thresholds and penalty values for trade evaluation
 */

export const EQUITY_RULE_CONFIG = {
  // Starting score for every trade
  baseScore: 100,

  // Thresholds for rule validation
  thresholds: {
    MAX_RISK_PERCENT: 1.0,  // Maximum acceptable risk per trade
    MIN_RR_RATIO: 1.5,       // Minimum risk-reward ratio
  },

  // Penalty points deducted for rule violations
  penalties: {
    NO_STOP_LOSS: 25,   // Critical: Trading without stop loss
    HIGH_RISK: 20,       // High: Risking more than allowed
    LOW_RR: 15,          // Medium: Poor risk-reward setup
    RULE_BROKEN: 30,     // Critical: Violated predefined trading rules
  },

  // Score boundaries for verdict classification
  verdicts: {
    GOOD: 80,      // Score >= 80
    AVERAGE: 60,   // Score >= 60 and < 80
    // BAD: < 60
  },
};
