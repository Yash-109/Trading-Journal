/**
 * Trade Result Component
 * Displays the evaluation result for a single trade
 */

export default function TradeResult({ result }) {
  if (!result) return null;

  const { tradeId, verdict, score, reasons } = result;

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

  const colors = verdictColors[verdict] || verdictColors.BAD;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Evaluation Result</h2>

      {/* Trade ID */}
      <div>
        <span className="text-sm text-gray-600">Trade ID: </span>
        <span className="text-lg font-semibold text-gray-800">{tradeId}</span>
      </div>

      {/* Verdict Badge */}
      <div className={`${colors.bg} ${colors.border} border-2 rounded-lg p-6 text-center`}>
        <div className="flex items-center justify-center gap-3">
          <span className={`inline-block w-3 h-3 rounded-full ${colors.badge}`}></span>
          <h3 className={`text-3xl font-bold ${colors.text}`}>{verdict}</h3>
        </div>
      </div>

      {/* Score Display */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Quality Score</span>
          <span className="text-2xl font-bold text-gray-800">{score}/100</span>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full ${colors.badge} transition-all duration-500 ease-out`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>

      {/* Penalty Reasons */}
      {reasons && reasons.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Issues Detected</h4>
          <div className="space-y-2">
            {reasons.map((reason, index) => (
              <div
                key={index}
                className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-3"
              >
                <span className="flex-shrink-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  !
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">{reason.message}</p>
                  <p className="text-xs text-red-600 mt-1">
                    Penalty: -{reason.penalty} points
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Message - No Issues */}
      {(!reasons || reasons.length === 0) && verdict === 'GOOD' && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center gap-3">
          <span className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-lg">
            ✓
          </span>
          <p className="text-sm font-medium text-green-800">
            Excellent! All trading rules were followed correctly.
          </p>
        </div>
      )}
    </div>
  );
}
