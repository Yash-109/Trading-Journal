/**
 * Session Trade Form Component
 * Allows adding and managing multiple trades for session evaluation
 */

import { useState } from 'react';

export default function SessionTradeForm({ trades, onTradesChange, onEvaluate, isLoading }) {
  const [formData, setFormData] = useState({
    tradeId: '',
    entryPrice: '',
    exitPrice: '',
    stopLoss: '',
    quantity: '',
    riskPercent: '',
    rrRatio: '',
    pnl: '',
    ruleFollowed: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddTrade = (e) => {
    e.preventDefault();

    // Convert to proper trade object
    const trade = {
      tradeId: formData.tradeId,
      market: 'EQUITY',
      entryPrice: parseFloat(formData.entryPrice),
      exitPrice: parseFloat(formData.exitPrice),
      stopLoss: formData.stopLoss ? parseFloat(formData.stopLoss) : null,
      quantity: parseFloat(formData.quantity, 10),
      riskPercent: parseFloat(formData.riskPercent),
      rrRatio: parseFloat(formData.rrRatio),
      pnl: parseFloat(formData.pnl),
      ruleFollowed: formData.ruleFollowed,
    };

    onTradesChange([...trades, trade]);

    // Reset form
    setFormData({
      tradeId: '',
      entryPrice: '',
      exitPrice: '',
      stopLoss: '',
      quantity: '',
      riskPercent: '',
      rrRatio: '',
      pnl: '',
      ruleFollowed: false,
    });
  };

  const handleRemoveTrade = (index) => {
    onTradesChange(trades.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Add Trade Form */}
      <form onSubmit={handleAddTrade} className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Add Trade to Session</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Trade ID */}
          <div>
            <label htmlFor="tradeId" className="block text-sm font-medium text-gray-700 mb-1">
              Trade ID *
            </label>
            <input
              type="text"
              id="tradeId"
              name="tradeId"
              value={formData.tradeId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., T001"
            />
          </div>

          {/* Entry Price */}
          <div>
            <label htmlFor="entryPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Entry Price *
            </label>
            <input
              type="number"
              step="0.01"
              id="entryPrice"
              name="entryPrice"
              value={formData.entryPrice}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="100.00"
            />
          </div>

          {/* Exit Price */}
          <div>
            <label htmlFor="exitPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Exit Price *
            </label>
            <input
              type="number"
              step="0.01"
              id="exitPrice"
              name="exitPrice"
              value={formData.exitPrice}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="105.00"
            />
          </div>

          {/* Stop Loss */}
          <div>
            <label htmlFor="stopLoss" className="block text-sm font-medium text-gray-700 mb-1">
              Stop Loss
            </label>
            <input
              type="number"
              step="0.01"
              id="stopLoss"
              name="stopLoss"
              value={formData.stopLoss}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="98.00"
            />
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity *
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="10"
            />
          </div>

          {/* Risk Percent */}
          <div>
            <label htmlFor="riskPercent" className="block text-sm font-medium text-gray-700 mb-1">
              Risk % *
            </label>
            <input
              type="number"
              step="0.1"
              id="riskPercent"
              name="riskPercent"
              value={formData.riskPercent}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.8"
            />
          </div>

          {/* RR Ratio */}
          <div>
            <label htmlFor="rrRatio" className="block text-sm font-medium text-gray-700 mb-1">
              Risk:Reward Ratio *
            </label>
            <input
              type="number"
              step="0.1"
              id="rrRatio"
              name="rrRatio"
              value={formData.rrRatio}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="2.5"
            />
          </div>

          {/* PnL */}
          <div>
            <label htmlFor="pnl" className="block text-sm font-medium text-gray-700 mb-1">
              P&L *
            </label>
            <input
              type="number"
              step="0.01"
              id="pnl"
              name="pnl"
              value={formData.pnl}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="50.00"
            />
          </div>
        </div>

        {/* Rule Followed Checkbox */}
        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            id="ruleFollowed"
            name="ruleFollowed"
            checked={formData.ruleFollowed}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="ruleFollowed" className="ml-2 text-sm font-medium text-gray-700">
            Trading rules were followed
          </label>
        </div>

        {/* Add Trade Button */}
        <button
          type="submit"
          className="mt-4 w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          + Add Trade to Session
        </button>
      </form>

      {/* Added Trades List */}
      {trades.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              Added Trades ({trades.length})
            </h3>
            <button
              onClick={onEvaluate}
              disabled={isLoading}
              className={`py-2 px-6 rounded-md font-medium text-white transition-colors ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }`}
            >
              {isLoading ? 'Evaluating...' : 'Evaluate Session'}
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {trades.map((trade, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="font-semibold text-gray-800">{trade.tradeId}</span>
                  <span className="text-sm text-gray-600">
                    Entry: ${trade.entryPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-600">
                    Exit: ${trade.exitPrice.toFixed(2)}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    P&L: ${trade.pnl.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveTrade(index)}
                  className="text-red-600 hover:text-red-800 font-medium text-sm px-3 py-1 rounded hover:bg-red-50 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {trades.length === 0 && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-600 text-lg">No trades added yet</p>
          <p className="text-gray-500 text-sm mt-1">
            Add at least one trade to evaluate your session
          </p>
        </div>
      )}
    </div>
  );
}
