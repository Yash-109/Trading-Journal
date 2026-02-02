/**
 * Trade Form Component
 * Form for inputting trade data for evaluation
 */

import { useState } from 'react';

export default function TradeForm({ onSubmit, isLoading }) {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert string inputs to numbers
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

    onSubmit(trade);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card-bg rounded-lg border border-gray-700 p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-100 mb-4">Trade Details</h2>

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
      <div className="flex items-center">
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

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
          isLoading
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'btn-primary'
        }`}
      >
        {isLoading ? 'Evaluating...' : 'Evaluate Trade'}
      </button>
    </form>
  );
}
