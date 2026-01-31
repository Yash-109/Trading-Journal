/**
 * Session Metrics Calculator
 * Aggregates trade-level verdicts into session-level metrics
 * Deterministic aggregation - no ML, no randomness
 */

// Fixed numeric mapping for consistency scoring
const VERDICT_SCORE_MAP = {
  GOOD: 100,
  AVERAGE: 60,
  BAD: 20,
};

/**
 * Count verdicts by category
 * @param {Array} evaluations - Array of trade evaluation results
 * @returns {Object} Verdict counts
 */
function countVerdicts(evaluations) {
  const counts = {
    GOOD: 0,
    AVERAGE: 0,
    BAD: 0,
  };

  for (const evaluation of evaluations) {
    const verdict = evaluation.verdict;
    if (counts.hasOwnProperty(verdict)) {
      counts[verdict]++;
    }
  }

  return counts;
}

/**
 * Calculate verdict percentages
 * @param {Object} verdictCounts - Verdict counts object
 * @param {number} totalTrades - Total number of trades
 * @returns {Object} Verdict percentages
 */
function calculateVerdictPercentages(verdictCounts, totalTrades) {
  if (totalTrades === 0) {
    return { GOOD: 0, AVERAGE: 0, BAD: 0 };
  }

  return {
    GOOD: Math.round((verdictCounts.GOOD / totalTrades) * 100),
    AVERAGE: Math.round((verdictCounts.AVERAGE / totalTrades) * 100),
    BAD: Math.round((verdictCounts.BAD / totalTrades) * 100),
  };
}

/**
 * Calculate session consistency score
 * Average of all trade verdict scores (0-100)
 * @param {Array} evaluations - Array of trade evaluation results
 * @returns {number} Consistency score (0-100)
 */
function calculateConsistencyScore(evaluations) {
  if (evaluations.length === 0) {
    return 0;
  }

  const totalScore = evaluations.reduce((sum, evaluation) => {
    const verdictScore = VERDICT_SCORE_MAP[evaluation.verdict] || 0;
    return sum + verdictScore;
  }, 0);

  return Math.round(totalScore / evaluations.length);
}

/**
 * Find most common failure reasons across all trades
 * @param {Array} evaluations - Array of trade evaluation results
 * @returns {Array} Top failure reasons with counts
 */
function findDominantFailureReasons(evaluations) {
  const reasonCounts = {};

  // Count all failure reasons
  for (const evaluation of evaluations) {
    // Safely check for reasons array
    if (!evaluation || !Array.isArray(evaluation.reasons)) {
      continue;
    }
    
    if (evaluation.reasons.length > 0) {
      for (const reason of evaluation.reasons) {
        // Validate reason object has required fields
        if (!reason || !reason.ruleId) {
          continue;
        }
        
        const ruleId = reason.ruleId;
        if (!reasonCounts[ruleId]) {
          reasonCounts[ruleId] = {
            ruleId,
            count: 0,
            message: reason.message || 'No message provided',
          };
        }
        reasonCounts[ruleId].count++;
      }
    }
  }

  // Convert to array and sort by count (descending)
  const sortedReasons = Object.values(reasonCounts).sort(
    (a, b) => b.count - a.count
  );

  // Return top 3 most common failures (or fewer if less than 3 exist)
  return sortedReasons.slice(0, 3);
}

/**
 * Aggregate trade evaluations into session metrics
 * @param {Array} evaluations - Array of trade evaluation results
 * @returns {Object} Session metrics
 */
export function aggregateSessionMetrics(evaluations) {
  if (!Array.isArray(evaluations) || evaluations.length === 0) {
    return {
      totalTrades: 0,
      verdictCounts: { GOOD: 0, AVERAGE: 0, BAD: 0 },
      verdictPercentages: { GOOD: 0, AVERAGE: 0, BAD: 0 },
      consistencyScore: 0,
      dominantFailureReasons: [],
    };
  }

  const totalTrades = evaluations.length;
  const verdictCounts = countVerdicts(evaluations);
  const verdictPercentages = calculateVerdictPercentages(verdictCounts, totalTrades);
  const consistencyScore = calculateConsistencyScore(evaluations);
  const dominantFailureReasons = findDominantFailureReasons(evaluations);

  return {
    totalTrades,
    verdictCounts,
    verdictPercentages,
    consistencyScore,
    dominantFailureReasons,
  };
}
