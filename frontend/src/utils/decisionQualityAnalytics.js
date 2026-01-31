/**
 * DECISION QUALITY ANALYTICS
 * 
 * Three-layer architecture for configurable, future-proof decision quality metrics:
 * 
 * 1. METRICS LAYER: Pure facts, no weights - computes raw statistics
 * 2. RULE CONFIGURATION LAYER: Centralized config with weights and thresholds
 * 3. RULE ENGINE LAYER: Applies config to metrics to compute discipline scores
 * 
 * DESIGN PHILOSOPHY:
 * - Weights and thresholds can be changed in ONE place (config object)
 * - No hard-coded formulas in analytics logic
 * - Easy to extend with new metrics
 * - Clean separation of concerns
 */

// ============================================================================
// LAYER 2: RULE CONFIGURATION LAYER
// ============================================================================

/**
 * Centralized configuration for decision quality rules
 * 
 * MODIFY THIS OBJECT to change weights and thresholds without touching logic
 * 
 * @property {Object} weights - Weights for different metrics (must sum to 1.0)
 * @property {Object} thresholds - Score thresholds for discipline labels
 */
export const DECISION_RULE_CONFIG = {
  // Weights for computing overall discipline score (must sum to 1.0)
  weights: {
    ruleFollow: 0.35,        // 35% - Following rules is most important
    tradeQuality: 0.30,      // 30% - Quality of trade decisions
    emotionStability: 0.20,  // 20% - Emotional control
    winRate: 0.15,           // 15% - Actual performance (intentionally lower)
  },
  
  // Thresholds for discipline labels (0-100 scale)
  thresholds: {
    good: 70,     // >= 70 = Good Discipline
    average: 50,  // >= 50 and < 70 = Average Discipline
    // < 50 = Poor Discipline
  },
  
  // Additional config for emotion stability scoring
  emotionConfig: {
    // Emotion scores: positive emotions = higher scores
    emotionScores: {
      'Calm': 10,
      'Hesitant': 6,
      'Fear': 4,
      'Greed': 3,
      'Overconfident': 2,
      'Revenge': 0,
    },
    maxScore: 10, // Maximum emotion score for normalization
  },
  
  // Config for trade quality buckets
  qualityBuckets: {
    poor: { min: 1, max: 3, label: 'Poor (1-3)' },
    average: { min: 4, max: 6, label: 'Average (4-6)' },
    good: { min: 7, max: 10, label: 'Good (7-10)' },
  },
};

// ============================================================================
// LAYER 1: METRICS LAYER (Pure Facts, No Weights)
// ============================================================================

/**
 * Compute raw metrics from trades
 * Pure facts - no interpretation, no weights applied
 * 
 * @param {Array} trades - Array of trade objects
 * @returns {Object} Raw metrics object
 */
export const computeRawMetrics = (trades) => {
  if (!trades || trades.length === 0) {
    return {
      totalTrades: 0,
      ruleFollowRate: 0,
      avgTradeQuality: 0,
      winRate: 0,
      pnlConsistency: 0,
      emotionStability: 0,
      emotionDistribution: {},
      tradeQualityDistribution: { poor: 0, average: 0, good: 0 },
    };
  }

  // 1. Rule Follow Rate
  const rulesFollowed = trades.filter(t => t.ruleFollowed === true).length;
  const ruleFollowRate = (rulesFollowed / trades.length) * 100;

  // 2. Average Trade Quality
  const qualitySum = trades.reduce((sum, t) => sum + (t.tradeQuality || 5), 0);
  const avgTradeQuality = qualitySum / trades.length;

  // 3. Win Rate
  const wins = trades.filter(t => t.pnl > 0).length;
  const winRate = (wins / trades.length) * 100;

  // 4. PnL Consistency (using coefficient of variation - lower is more consistent)
  const pnlValues = trades.map(t => t.pnl || 0);
  const pnlMean = pnlValues.reduce((sum, val) => sum + val, 0) / pnlValues.length;
  const pnlVariance = pnlValues.reduce((sum, val) => sum + Math.pow(val - pnlMean, 2), 0) / pnlValues.length;
  const pnlStdDev = Math.sqrt(pnlVariance);
  
  // Convert to consistency score (0-100, higher = more consistent)
  // Using coefficient of variation: CV = stdDev / |mean|
  // Then convert to score where low CV = high consistency
  const cv = Math.abs(pnlMean) > 0 ? pnlStdDev / Math.abs(pnlMean) : 1;
  const pnlConsistency = Math.max(0, Math.min(100, 100 * (1 - Math.min(cv, 1))));

  // 5. Emotion Stability Score
  const emotionCounts = {};
  trades.forEach(t => {
    const emotion = t.emotion || 'Calm';
    emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
  });

  // Calculate weighted average emotion score
  const emotionScores = DECISION_RULE_CONFIG.emotionConfig.emotionScores;
  const maxEmotionScore = DECISION_RULE_CONFIG.emotionConfig.maxScore;
  
  const totalEmotionScore = trades.reduce((sum, t) => {
    const emotion = t.emotion || 'Calm';
    return sum + (emotionScores[emotion] || 5);
  }, 0);
  
  const avgEmotionScore = totalEmotionScore / trades.length;
  const emotionStability = (avgEmotionScore / maxEmotionScore) * 100;

  // Emotion distribution
  const emotionDistribution = {};
  Object.entries(emotionCounts).forEach(([emotion, count]) => {
    emotionDistribution[emotion] = {
      count,
      percentage: (count / trades.length) * 100,
    };
  });

  // 6. Trade Quality Distribution
  const { qualityBuckets } = DECISION_RULE_CONFIG;
  const tradeQualityDistribution = {
    poor: trades.filter(t => {
      const q = t.tradeQuality || 5;
      return q >= qualityBuckets.poor.min && q <= qualityBuckets.poor.max;
    }).length,
    average: trades.filter(t => {
      const q = t.tradeQuality || 5;
      return q >= qualityBuckets.average.min && q <= qualityBuckets.average.max;
    }).length,
    good: trades.filter(t => {
      const q = t.tradeQuality || 5;
      return q >= qualityBuckets.good.min && q <= qualityBuckets.good.max;
    }).length,
  };

  return {
    totalTrades: trades.length,
    ruleFollowRate,
    avgTradeQuality,
    winRate,
    pnlConsistency,
    emotionStability,
    emotionDistribution,
    tradeQualityDistribution,
  };
};

/**
 * Compute performance comparison: rule-followed vs rule-broken trades
 * 
 * @param {Array} trades - Array of trade objects
 * @returns {Object} Comparison metrics
 */
export const computeRuleComparisonMetrics = (trades) => {
  if (!trades || trades.length === 0) {
    return {
      ruleFollowed: { trades: 0, winRate: 0, avgPnl: 0, totalPnl: 0 },
      ruleBroken: { trades: 0, winRate: 0, avgPnl: 0, totalPnl: 0 },
    };
  }

  const followedTrades = trades.filter(t => t.ruleFollowed === true);
  const brokenTrades = trades.filter(t => t.ruleFollowed === false);

  const computeStats = (tradesList) => {
    if (tradesList.length === 0) {
      return { trades: 0, winRate: 0, avgPnl: 0, totalPnl: 0 };
    }
    const wins = tradesList.filter(t => t.pnl > 0).length;
    const totalPnl = tradesList.reduce((sum, t) => sum + (t.pnl || 0), 0);
    return {
      trades: tradesList.length,
      winRate: (wins / tradesList.length) * 100,
      avgPnl: totalPnl / tradesList.length,
      totalPnl,
    };
  };

  return {
    ruleFollowed: computeStats(followedTrades),
    ruleBroken: computeStats(brokenTrades),
  };
};

/**
 * Compute performance by trade quality bucket
 * 
 * @param {Array} trades - Array of trade objects
 * @returns {Object} Performance by quality bucket
 */
export const computeQualityBucketMetrics = (trades) => {
  if (!trades || trades.length === 0) {
    return {
      poor: { trades: 0, winRate: 0, avgPnl: 0 },
      average: { trades: 0, winRate: 0, avgPnl: 0 },
      good: { trades: 0, winRate: 0, avgPnl: 0 },
    };
  }

  const { qualityBuckets } = DECISION_RULE_CONFIG;

  const poorTrades = trades.filter(t => {
    const q = t.tradeQuality || 5;
    return q >= qualityBuckets.poor.min && q <= qualityBuckets.poor.max;
  });

  const averageTrades = trades.filter(t => {
    const q = t.tradeQuality || 5;
    return q >= qualityBuckets.average.min && q <= qualityBuckets.average.max;
  });

  const goodTrades = trades.filter(t => {
    const q = t.tradeQuality || 5;
    return q >= qualityBuckets.good.min && q <= qualityBuckets.good.max;
  });

  const computeStats = (tradesList) => {
    if (tradesList.length === 0) {
      return { trades: 0, winRate: 0, avgPnl: 0 };
    }
    const wins = tradesList.filter(t => t.pnl > 0).length;
    const totalPnl = tradesList.reduce((sum, t) => sum + (t.pnl || 0), 0);
    return {
      trades: tradesList.length,
      winRate: (wins / tradesList.length) * 100,
      avgPnl: totalPnl / tradesList.length,
    };
  };

  return {
    poor: computeStats(poorTrades),
    average: computeStats(averageTrades),
    good: computeStats(goodTrades),
  };
};

/**
 * Compute performance by emotion
 * 
 * @param {Array} trades - Array of trade objects
 * @returns {Array} Array of emotion performance objects
 */
export const computeEmotionPerformanceMetrics = (trades) => {
  if (!trades || trades.length === 0) {
    return [];
  }

  const byEmotion = {};
  trades.forEach(trade => {
    const emotion = trade.emotion || 'Calm';
    if (!byEmotion[emotion]) {
      byEmotion[emotion] = { trades: [], wins: 0, totalPnl: 0 };
    }
    byEmotion[emotion].trades.push(trade);
    byEmotion[emotion].totalPnl += trade.pnl || 0;
    if (trade.pnl > 0) byEmotion[emotion].wins++;
  });

  return Object.entries(byEmotion).map(([emotion, data]) => ({
    emotion,
    trades: data.trades.length,
    winRate: (data.wins / data.trades.length) * 100,
    avgPnl: data.totalPnl / data.trades.length,
    totalPnl: data.totalPnl,
  })).sort((a, b) => b.totalPnl - a.totalPnl);
};

// ============================================================================
// LAYER 3: RULE ENGINE LAYER
// ============================================================================

/**
 * Compute discipline score using metrics and config
 * 
 * This is the ONLY function that interprets metrics using weights
 * To change scoring logic, modify DECISION_RULE_CONFIG, not this function
 * 
 * @param {Object} metrics - Raw metrics from computeRawMetrics
 * @param {Object} config - Configuration object (defaults to DECISION_RULE_CONFIG)
 * @returns {Object} { disciplineScore, disciplineLabel, breakdown }
 */
export const computeDisciplineScore = (metrics, config = DECISION_RULE_CONFIG) => {
  const { weights, thresholds } = config;

  // Normalize avgTradeQuality to 0-100 scale (it's 1-10)
  const normalizedQuality = ((metrics.avgTradeQuality - 1) / 9) * 100;

  // Calculate weighted score
  const breakdown = {
    ruleFollow: {
      value: metrics.ruleFollowRate,
      weight: weights.ruleFollow,
      weighted: metrics.ruleFollowRate * weights.ruleFollow,
    },
    tradeQuality: {
      value: normalizedQuality,
      weight: weights.tradeQuality,
      weighted: normalizedQuality * weights.tradeQuality,
    },
    emotionStability: {
      value: metrics.emotionStability,
      weight: weights.emotionStability,
      weighted: metrics.emotionStability * weights.emotionStability,
    },
    winRate: {
      value: metrics.winRate,
      weight: weights.winRate,
      weighted: metrics.winRate * weights.winRate,
    },
  };

  // Sum weighted scores
  const disciplineScore = Object.values(breakdown).reduce(
    (sum, item) => sum + item.weighted,
    0
  );

  // Determine label based on thresholds
  let disciplineLabel = 'Poor';
  if (disciplineScore >= thresholds.good) {
    disciplineLabel = 'Good';
  } else if (disciplineScore >= thresholds.average) {
    disciplineLabel = 'Average';
  }

  return {
    disciplineScore: Math.round(disciplineScore * 10) / 10, // Round to 1 decimal
    disciplineLabel,
    breakdown,
  };
};

// ============================================================================
// CONVENIENCE FUNCTION: ALL-IN-ONE
// ============================================================================

/**
 * Compute complete decision quality analytics
 * Convenience function that runs all layers
 * 
 * @param {Array} trades - Array of trade objects
 * @returns {Object} Complete analytics object
 */
export const computeDecisionQualityAnalytics = (trades) => {
  // Layer 1: Compute raw metrics
  const rawMetrics = computeRawMetrics(trades);
  const ruleComparison = computeRuleComparisonMetrics(trades);
  const qualityBuckets = computeQualityBucketMetrics(trades);
  const emotionPerformance = computeEmotionPerformanceMetrics(trades);

  // Layer 3: Apply rule engine
  const disciplineAnalysis = computeDisciplineScore(rawMetrics);

  return {
    // Raw metrics
    rawMetrics,
    
    // Detailed breakdowns
    ruleComparison,
    qualityBuckets,
    emotionPerformance,
    
    // Discipline scoring
    disciplineScore: disciplineAnalysis.disciplineScore,
    disciplineLabel: disciplineAnalysis.disciplineLabel,
    disciplineBreakdown: disciplineAnalysis.breakdown,
    
    // Config used (for transparency)
    config: DECISION_RULE_CONFIG,
  };
};
