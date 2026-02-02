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
      <form onSubmit={handleAddTrade} className="bg-card-bg rounded-lg border border-gray-700 p-6">
        <h3 className="text-xl font-bold text-gray-100 mb-4">Add Trade to Session</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Trade ID */}
          <div>
            <label htmlFor="tradeId" className="block text-sm font-medium text-gray-300 mb-2">
              Trade ID *
            </label>
            <input
              type="text"
              id="tradeId"
              name="tradeId"
              value={formData.tradeId}
              onChange={handleChange}
              required
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              placeholder="e.g., T001"
            />
          </div>

          {/* Entry Price */}
          <div>
            <label htmlFor="entryPrice" className="block text-sm font-medium text-gray-300 mb-2">
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
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              placeholder="100.00"
            />
          </div>

          {/* Exit Price */}
          <div>
            <label htmlFor="exitPrice" className="block text-sm font-medium text-gray-300 mb-2">
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
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              placeholder="105.00"
            />
          </div>

          {/* Stop Loss */}
          <div>
            <label htmlFor="stopLoss" className="block text-sm font-medium text-gray-300 mb-2">
              Stop Loss
            </label>
            <input
              type="number"
              step="0.01"
              id="stopLoss"
              name="stopLoss"
              value={formData.stopLoss}
              onChange={handleChange}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              placeholder="98.00"
            />
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-2">
              Quantity *
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              placeholder="10"
            />
          </div>

          {/* Risk Percent */}
          <div>
            <label htmlFor="riskPercent" className="block text-sm font-medium text-gray-300 mb-2">
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
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              placeholder="0.8"
            />
          </div>

          {/* RR Ratio */}
          <div>
            <label htmlFor="rrRatio" className="block text-sm font-medium text-gray-300 mb-2">
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
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              placeholder="2.5"
            />
          </div>

          {/* PnL */}
          <div>
            <label htmlFor="pnl" className="block text-sm font-medium text-gray-300 mb-2">
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
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
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
            className="w-5 h-5 rounded border-dark-border bg-dark-bg text-gold-500 focus:ring-2 focus:ring-gold-500"
          />
          <label htmlFor="ruleFollowed" className="ml-2 text-sm font-medium text-gray-300">
            Trading rules were followed
          </label>
        </div>

        {/* Add Trade Button */}
        <button
          type="submit"
          className="mt-4 w-full btn-primary py-2.5"
        >
          + Add Trade to Session
        </button>
      </form>

      {/* Added Trades List */}
      {trades.length > 0 && (
        <div className="bg-card-bg rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-100">
              Added Trades ({trades.length})
            </h3>
            <button
              onClick={onEvaluate}
              disabled={isLoading}
              className={`py-2.5 px-6 rounded-lg font-semibold transition-colors ${
                isLoading
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              {isLoading ? 'Evaluating...' : 'Evaluate Session'}
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {trades.map((trade, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-dark-bg rounded-lg border border-dark-border hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="font-semibold text-gray-100">{trade.tradeId}</span>
                  <span className="text-sm text-gray-400">
                    Entry: ${trade.entryPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-400">
                    Exit: ${trade.exitPrice.toFixed(2)}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    P&L: ${trade.pnl.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveTrade(index)}
                  className="text-red-400 hover:text-red-300 font-medium text-sm px-3 py-1 rounded hover:bg-red-900/20 transition-colors"
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
        <div className="bg-dark-bg border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
          <p className="text-gray-300 text-lg">No trades added yet</p>
          <p className="text-gray-500 text-sm mt-1">
            Add at least one trade to evaluate your session
          </p>
        </div>
      )}
    </div>
  );
}
