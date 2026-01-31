/**
 * Session Evaluation Page
 * Evaluates multiple trades as a trading session
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import SessionTradeForm from '../components/SessionTradeForm';
import SessionSummary from '../components/SessionSummary';
import { evaluateSession } from '../services/evaluationApi';

export default function SessionEvaluation() {
  const [trades, setTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleEvaluate = async () => {
    if (trades.length === 0) {
      toast.error('Please add at least one trade to evaluate', { duration: 3000 });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const evaluationResult = await evaluateSession(trades);
      setResult(evaluationResult);

      // Show success toast with session verdict
      const verdictEmoji = {
        GOOD: '✅',
        AVERAGE: '⚠️',
        BAD: '❌',
      };
      toast.success(
        `Session evaluated: ${verdictEmoji[evaluationResult.sessionVerdict]} ${evaluationResult.sessionVerdict}`,
        { duration: 3000 }
      );
    } catch (error) {
      console.error('Session evaluation error:', error);
      toast.error(error.message || 'Failed to evaluate session', { duration: 4000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Session Evaluation</h1>
          <p className="text-gray-600">
            Evaluate multiple trades to analyze your trading session consistency
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Trade Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SessionTradeForm
              trades={trades}
              onTradesChange={setTrades}
              onEvaluate={handleEvaluate}
              isLoading={isLoading}
            />
          </motion.div>

          {/* Right Column - Session Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:sticky lg:top-8 lg:self-start"
          >
            {result ? (
              <SessionSummary result={result} />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 h-full flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <svg
                    className="w-16 h-16 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <p className="text-lg font-medium">No session evaluated yet</p>
                  <p className="text-sm mt-1">
                    Add trades and click "Evaluate Session" to see results
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Session Evaluation Benefits
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                1
              </span>
              <span>
                <strong>Consistency Analysis:</strong> Measure how consistently you follow trading rules across multiple trades
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                2
              </span>
              <span>
                <strong>Pattern Recognition:</strong> Identify recurring mistakes and areas for improvement
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                3
              </span>
              <span>
                <strong>Overall Performance:</strong> Get a holistic view of your trading discipline and quality
              </span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
