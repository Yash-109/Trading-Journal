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
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Trade Details</h2>

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
      <div className="flex items-center">
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

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        }`}
      >
        {isLoading ? 'Evaluating...' : 'Evaluate Trade'}
      </button>
    </form>
  );
}
