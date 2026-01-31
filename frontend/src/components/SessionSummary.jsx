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
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-300',
      badge: 'bg-green-500',
    },
    AVERAGE: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-300',
      badge: 'bg-yellow-500',
    },
    BAD: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-300',
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
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Session Evaluation</h2>

      {/* Session Verdict Badge */}
      <div className={`${colors.bg} ${colors.border} border-2 rounded-lg p-6 text-center`}>
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className={`inline-block w-3 h-3 rounded-full ${colors.badge}`}></span>
          <h3 className={`text-3xl font-bold ${colors.text}`}>{sessionVerdict}</h3>
        </div>
        <p className="text-sm text-gray-600">Session Verdict</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Trades */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Total Trades</p>
          <p className="text-3xl font-bold text-gray-800">{totalTrades}</p>
        </div>

        {/* Consistency Score */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Consistency Score</p>
          <p className="text-3xl font-bold text-gray-800">{consistencyScore}/100</p>
        </div>
      </div>

      {/* Consistency Score Progress Bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Consistency</span>
          <span className="text-sm font-semibold text-gray-800">{consistencyScore}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full ${colors.badge} transition-all duration-700 ease-out`}
            style={{ width: `${consistencyScore}%` }}
          ></div>
        </div>
      </div>

      {/* Verdict Distribution */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Verdict Distribution</h4>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-green-700">{verdictCounts.GOOD}</p>
            <p className="text-xs text-green-600 mt-1">GOOD</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-yellow-700">{verdictCounts.AVERAGE}</p>
            <p className="text-xs text-yellow-600 mt-1">AVERAGE</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-red-700">{verdictCounts.BAD}</p>
            <p className="text-xs text-red-600 mt-1">BAD</p>
          </div>
        </div>

        {/* Pie Chart Visualization */}
        {chartData.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
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
          <h4 className="text-lg font-semibold text-gray-800 mb-3">
            Most Common Issues
          </h4>
          <div className="space-y-2">
            {dominantFailureReasons.map((reason, index) => (
              <div
                key={index}
                className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center justify-between"
              >
                <div className="flex items-start gap-3 flex-1">
                  <span className="flex-shrink-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-red-800">{reason.message}</p>
                    <p className="text-xs text-red-600 mt-1">Rule: {reason.ruleId}</p>
                  </div>
                </div>
                <span className="flex-shrink-0 ml-3 px-3 py-1 bg-red-200 text-red-800 text-sm font-semibold rounded-full">
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
          <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-lg">
              ✓
            </span>
            <p className="text-sm font-medium text-green-800">
              Excellent session! All trades followed the rules consistently.
            </p>
          </div>
        )}
    </div>
  );
}
