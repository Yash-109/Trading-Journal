/**
 * Session Summary Component
 * Displays session evaluation results from backend
 */

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function SessionSummary({ result }) {
  if (!result) return null;

  const {
    totalTrades,
    sessionVerdict,
    consistencyScore,
    verdictCounts,
    dominantFailureReasons,
  } = result;

  // Verdict color styling
  const verdictColors = {
    GOOD: {
      bg: 'bg-green-900/30',
      text: 'text-green-400',
      border: 'border-green-700',
      badge: 'bg-green-500',
    },
    AVERAGE: {
      bg: 'bg-yellow-900/30',
      text: 'text-yellow-400',
      border: 'border-yellow-700',
      badge: 'bg-yellow-500',
    },
    BAD: {
      bg: 'bg-red-900/30',
      text: 'text-red-400',
      border: 'border-red-700',
      badge: 'bg-red-500',
    },
  };

  const colors = verdictColors[sessionVerdict] || verdictColors.BAD;

  // Prepare chart data from verdictCounts
  const chartData = [
    { name: 'GOOD', value: verdictCounts.GOOD, color: '#10b981' },
    { name: 'AVERAGE', value: verdictCounts.AVERAGE, color: '#f59e0b' },
    { name: 'BAD', value: verdictCounts.BAD, color: '#ef4444' },
  ].filter((item) => item.value > 0);

  return (
    <div className="bg-card-bg rounded-lg border border-gray-700 p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-100">Session Evaluation</h2>

      {/* Session Verdict Badge */}
      <div className={`${colors.bg} ${colors.border} border-2 rounded-lg p-6 text-center`}>
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className={`inline-block w-3 h-3 rounded-full ${colors.badge}`}></span>
          <h3 className={`text-3xl font-bold ${colors.text}`}>{sessionVerdict}</h3>
        </div>
        <p className="text-sm text-gray-400">Session Verdict</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Trades */}
        <div className="bg-dark-bg rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Total Trades</p>
          <p className="text-3xl font-bold text-gray-100">{totalTrades}</p>
        </div>

        {/* Consistency Score */}
        <div className="bg-dark-bg rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Consistency Score</p>
          <p className="text-3xl font-bold text-gray-100">{consistencyScore}/100</p>
        </div>
      </div>

      {/* Consistency Score Progress Bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-300">Overall Consistency</span>
          <span className="text-sm font-semibold text-gray-100">{consistencyScore}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full ${colors.badge} transition-all duration-700 ease-out`}
            style={{ width: `${consistencyScore}%` }}
          ></div>
        </div>
      </div>

      {/* Verdict Distribution */}
      <div>
        <h4 className="text-lg font-semibold text-gray-100 mb-3">Verdict Distribution</h4>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-green-400">{verdictCounts.GOOD}</p>
            <p className="text-xs text-green-500 mt-1">GOOD</p>
          </div>
          <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-yellow-400">{verdictCounts.AVERAGE}</p>
            <p className="text-xs text-yellow-500 mt-1">AVERAGE</p>
          </div>
          <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-red-400">{verdictCounts.BAD}</p>
            <p className="text-xs text-red-500 mt-1">BAD</p>
          </div>
        </div>

        {/* Pie Chart Visualization */}
        {chartData.length > 0 && (
          <div className="bg-dark-bg rounded-lg p-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Dominant Failure Reasons */}
      {dominantFailureReasons && dominantFailureReasons.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-100 mb-3">
            Most Common Issues
          </h4>
          <div className="space-y-2">
            {dominantFailureReasons.map((reason, index) => (
              <div
                key={index}
                className="bg-red-900/20 border border-red-700/50 rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex items-start gap-3 flex-1">
                  <span className="flex-shrink-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-red-400">{reason.message}</p>
                    <p className="text-xs text-red-500 mt-1">Rule: {reason.ruleId}</p>
                  </div>
                </div>
                <span className="flex-shrink-0 ml-3 px-3 py-1 bg-red-900/40 text-red-400 text-sm font-semibold rounded-full">
                  {reason.count} trades
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Message - No Issues */}
      {(!dominantFailureReasons || dominantFailureReasons.length === 0) &&
        sessionVerdict === 'GOOD' && (
          <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4 flex items-center gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-lg">
              ✓
            </span>
            <p className="text-sm font-medium text-green-400">
              Excellent session! All trades followed the rules consistently.
            </p>
          </div>
        )}
    </div>
  );
}
