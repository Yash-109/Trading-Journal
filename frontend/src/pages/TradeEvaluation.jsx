/**
 * Trade Evaluation Page
 * Main page for evaluating individual trades
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import TradeForm from '../components/TradeForm';
import TradeResult from '../components/TradeResult';
import { evaluateTrade } from '../services/evaluationApi';

export default function TradeEvaluation() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (trade) => {
    setIsLoading(true);
    setResult(null);

    try {
      const evaluationResult = await evaluateTrade(trade);
      setResult(evaluationResult);
      
      // Show success toast with verdict
      const verdictEmoji = {
        GOOD: '✅',
        AVERAGE: '⚠️',
        BAD: '❌',
      };
      toast.success(
        `Trade evaluated: ${verdictEmoji[evaluationResult.verdict]} ${evaluationResult.verdict}`,
        { duration: 3000 }
      );
    } catch (error) {
      console.error('Evaluation error:', error);
      toast.error(error.message || 'Failed to evaluate trade', { duration: 4000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Trade Evaluation</h1>
        <p className="text-gray-400">
          Evaluate your trade quality using our rule-based engine
        </p>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Trade Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <TradeForm onSubmit={handleSubmit} isLoading={isLoading} />
        </motion.div>

        {/* Right Column - Trade Result */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {result ? (
            <TradeResult result={result} />
          ) : (
            <div className="bg-card-bg rounded-lg border border-gray-700 p-6 h-full flex items-center justify-center">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-lg font-medium">No evaluation yet</p>
                <p className="text-sm mt-1">Fill in the form and submit to see results</p>
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
        className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-blue-300 mb-3">How It Works</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
              1
            </span>
            <span>Enter your trade details including entry, exit, stop loss, and risk metrics</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
              2
            </span>
            <span>Our rule engine evaluates your trade against professional trading standards</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
              3
            </span>
            <span>Receive a verdict (GOOD/AVERAGE/BAD) with a quality score and actionable feedback</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
