import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useApp } from '../context/AppContext';
import { formatPnLWithSign, getCurrencySymbol } from '../utils/currencyFormatter';

const TradeModal = ({ isOpen, onClose, trade = null }) => {
  const { addTrade, updateTrade, settings } = useApp();

  const [formData, setFormData] = useState({
    id: '',
    date: new Date().toISOString().split('T')[0],
    pair: '',
    market: 'FOREX',
    instrumentType: '',
    direction: 'Buy',
    entry: '',
    stopLoss: '',
    takeProfit: '',
    exit: '',
    lotSize: '',
    // Indian market fields
    symbol: '',
    lots: '',
    optionType: '',
    strikePrice: '',
    expiryDate: '',
    profitLoss: 0,
    rr: 0,
    session: 'London',
    strategy: '',
    ruleFollowed: true,
    emotion: 'Calm',
    tradeQuality: 5,
    notes: '',
  });

  useEffect(() => {
    if (trade) {
      setFormData(trade);
    } else {
      setFormData({
        id: uuidv4(),
        date: new Date().toISOString().split('T')[0],
        pair: '',
        market: 'FOREX',
        instrumentType: '',
        direction: 'Buy',
        entry: '',
        stopLoss: '',
        takeProfit: '',
        exit: '',
        lotSize: '',
        // Indian market fields
        symbol: '',
        lots: '',
        optionType: '',
        strikePrice: '',
        expiryDate: '',
        profitLoss: 0,
        rr: 0,
        session: 'London',
        strategy: '',
        ruleFollowed: true,
        emotion: 'Calm',
        tradeQuality: 5,
        notes: '',
      });
    }
  }, [trade, isOpen]);

  // Calculate P/L and RR
  useEffect(() => {
    const { entry, exit, stopLoss, takeProfit, direction, lotSize, market, lots, symbol, instrumentType } = formData;
    
    // Determine if we have the required fields for calculation
    const hasForexFields = entry && exit && lotSize;
    const hasIndianFields = entry && exit && lots;
    
    if ((market === 'INDIAN' && hasIndianFields) || (market !== 'INDIAN' && hasForexFields)) {
      const entryPrice = parseFloat(entry);
      const exitPrice = parseFloat(exit);
      
      let pl = 0;
      
      if (market === 'INDIAN') {
        // Indian market: lot-based calculation
        // For INDEX/FNO: lots × lotSize × price difference
        const numLots = parseFloat(lots);
        
        // Lot sizes for Indian indices (matching backend config)
        const lotSizes = {
          NIFTY: 25,
          BANKNIFTY: 15,
          FINNIFTY: 25,
          SENSEX: 10,
          MIDCPNIFTY: 50,
        };
        
        const upperSymbol = (symbol || '').toUpperCase().trim();
        const lotSize = lotSizes[upperSymbol] || 1;
        const quantity = numLots * lotSize;
        
        if (direction === 'Buy') {
          pl = (exitPrice - entryPrice) * quantity;
        } else {
          pl = (entryPrice - exitPrice) * quantity;
        }
      } else {
        // FOREX/CRYPTO: lot-based calculation
        const lot = parseFloat(lotSize);
        
        if (direction === 'Buy') {
          pl = (exitPrice - entryPrice) * lot;
        } else {
          pl = (entryPrice - exitPrice) * lot;
        }
      }
      
      // R:R calculation (same for all markets)
      let rr = 0;
      if (stopLoss && takeProfit) {
        const slPrice = parseFloat(stopLoss);
        const tpPrice = parseFloat(takeProfit);
        
        if (direction === 'Buy') {
          const risk = entryPrice - slPrice;
          const reward = tpPrice - entryPrice;
          rr = risk !== 0 ? reward / risk : 0;
        } else {
          const risk = slPrice - entryPrice;
          const reward = entryPrice - tpPrice;
          rr = risk !== 0 ? reward / risk : 0;
        }
      }
      
      setFormData(prev => ({ ...prev, profitLoss: pl, rr: parseFloat(Number(rr || 0).toFixed(2)) }));
    }
  }, [formData.entry, formData.exit, formData.stopLoss, formData.takeProfit, formData.direction, formData.lotSize, formData.market, formData.lots, formData.symbol, formData.instrumentType]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Market-aware validation
    if (formData.market === 'INDIAN') {
      if (!formData.symbol || !formData.entry || !formData.exit) {
        alert('Please fill in required fields: Symbol, Entry, and Exit');
        return;
      }

      if (formData.instrumentType === 'FNO') {
        if (!formData.optionType || !formData.strikePrice || !formData.expiryDate) {
          alert('Please fill in required F&O fields: Option Type, Strike Price, and Expiry Date');
          return;
        }
      }
    } else {
      // FOREX/CRYPTO validation
      if (!formData.pair || !formData.entry || !formData.exit) {
        alert('Please fill in required fields: Pair, Entry, and Exit');
        return;
      }
    }

    // Normalize payload based on market type
    let payload;
    
    if (formData.market === 'INDIAN') {
      // Indian market payload
      payload = {
        id: formData.id,
        market: formData.market,
        instrumentType: formData.instrumentType,
        symbol: formData.symbol,
        direction: formData.direction,
        entry: formData.entry,
        exit: formData.exit,
        lots: formData.lots,
        date: formData.date,
        strategy: formData.strategy,
        ruleFollowed: formData.ruleFollowed,
        emotion: formData.emotion,
        tradeQuality: formData.tradeQuality,
        notes: formData.notes,
      };
      
      // Add F&O specific fields
      if (formData.instrumentType === 'FNO') {
        payload.optionType = formData.optionType;
        payload.strikePrice = formData.strikePrice;
        payload.expiryDate = formData.expiryDate;
      }
    } else {
      // FOREX/CRYPTO payload (preserve existing behavior)
      payload = {
        id: formData.id,
        market: formData.market,
        pair: formData.pair,
        direction: formData.direction,
        entry: formData.entry,
        stopLoss: formData.stopLoss,
        takeProfit: formData.takeProfit,
        exit: formData.exit,
        lotSize: formData.lotSize,
        profitLoss: formData.profitLoss,
        rr: formData.rr,
        session: formData.session,
        strategy: formData.strategy,
        ruleFollowed: formData.ruleFollowed,
        emotion: formData.emotion,
        tradeQuality: formData.tradeQuality,
        notes: formData.notes,
        date: formData.date,
      };
    }

    if (trade) {
      await updateTrade(payload);
    } else {
      await addTrade(payload);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 transition-opacity modal-backdrop"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-dark-card rounded-xl shadow-2xl transform transition-all sm:max-w-4xl sm:w-full border border-dark-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-dark-border">
              <h2 className="text-2xl font-bold text-white">
                {trade ? 'Edit Trade' : 'Add New Trade'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-dark-hover transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* Market */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Market *</label>
                  <select
                    name="market"
                    value={formData.market}
                    onChange={handleChange}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  >
                    <option value="FOREX">FOREX</option>
                    <option value="CRYPTO">CRYPTO</option>
                    <option value="INDIAN">INDIAN</option>
                  </select>
                </div>

                {/* Instrument Type (INDIAN only) */}
                {formData.market === 'INDIAN' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Instrument Type *</label>
                    <select
                      name="instrumentType"
                      value={formData.instrumentType}
                      onChange={handleChange}
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select...</option>
                      <option value="INDEX">INDEX</option>
                      <option value="FNO">F&O</option>
                    </select>
                  </div>
                )}

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Pair (FOREX/CRYPTO) or Symbol (INDIAN) */}
                {formData.market === 'INDIAN' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Symbol *</label>
                    <input
                      type="text"
                      name="symbol"
                      value={formData.symbol}
                      onChange={handleChange}
                      placeholder="e.g., NIFTY, BANKNIFTY"
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Pair *</label>
                    <input
                      type="text"
                      name="pair"
                      value={formData.pair}
                      onChange={handleChange}
                      list="pairs-list"
                      placeholder="e.g., XAUUSD"
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      required
                    />
                    <datalist id="pairs-list">
                      {settings.pairs.map(pair => (
                        <option key={pair} value={pair} />
                      ))}
                    </datalist>
                  </div>
                )}

                {/* Direction */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Direction *</label>
                  <select
                    name="direction"
                    value={formData.direction}
                    onChange={handleChange}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  >
                    <option value="Buy">Buy</option>
                    <option value="Sell">Sell</option>
                  </select>
                </div>

                {/* Option Type (F&O only) */}
                {formData.market === 'INDIAN' && formData.instrumentType === 'FNO' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Option Type *</label>
                    <select
                      name="optionType"
                      value={formData.optionType}
                      onChange={handleChange}
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select...</option>
                      <option value="CE">CE (Call)</option>
                      <option value="PE">PE (Put)</option>
                    </select>
                  </div>
                )}

                {/* Strike Price (F&O only) */}
                {formData.market === 'INDIAN' && formData.instrumentType === 'FNO' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Strike Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      name="strikePrice"
                      value={formData.strikePrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      required
                    />
                  </div>
                )}

                {/* Expiry Date (F&O only) */}
                {formData.market === 'INDIAN' && formData.instrumentType === 'FNO' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Expiry Date *</label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      required
                    />
                  </div>
                )}

                {/* Entry */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Entry Price *</label>
                  <input
                    type="number"
                    step="0.00001"
                    name="entry"
                    value={formData.entry}
                    onChange={handleChange}
                    placeholder="0.00000"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Stop Loss */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Stop Loss</label>
                  <input
                    type="number"
                    step="0.00001"
                    name="stopLoss"
                    value={formData.stopLoss}
                    onChange={handleChange}
                    placeholder="0.00000"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  />
                </div>

                {/* Take Profit */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Take Profit</label>
                  <input
                    type="number"
                    step="0.00001"
                    name="takeProfit"
                    value={formData.takeProfit}
                    onChange={handleChange}
                    placeholder="0.00000"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  />
                </div>

                {/* Exit */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Exit Price *</label>
                  <input
                    type="number"
                    step="0.00001"
                    name="exit"
                    value={formData.exit}
                    onChange={handleChange}
                    placeholder="0.00000"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Lot Size (FOREX/CRYPTO) or Lots (INDIAN) */}
                {formData.market === 'INDIAN' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Lots {(formData.instrumentType === 'INDEX' || formData.instrumentType === 'FNO') && '*'}
                    </label>
                    <input
                      type="number"
                      step="1"
                      name="lots"
                      value={formData.lots}
                      onChange={handleChange}
                      placeholder="Number of lots"
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    />
                    {(formData.instrumentType === 'INDEX' || formData.instrumentType === 'FNO') && formData.symbol && (
                      <p className="text-xs text-gray-400 mt-1">
                        Lot size varies by index (e.g., NIFTY: 25, BANKNIFTY: 15)
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Lot Size</label>
                    <input
                      type="number"
                      step="0.01"
                      name="lotSize"
                      value={formData.lotSize}
                      onChange={handleChange}
                      placeholder="0.01"
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    />
                  </div>
                )}

                {/* Session (only for FOREX/CRYPTO) */}
                {formData.market !== 'INDIAN' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Session</label>
                    <select
                      name="session"
                      value={formData.session}
                      onChange={handleChange}
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    >
                      <option value="London">London</option>
                      <option value="New York">New York</option>
                      <option value="Asia">Asia</option>
                      <option value="Sydney">Sydney</option>
                    </select>
                  </div>
                )}

                {/* Strategy */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Strategy</label>
                  <input
                    type="text"
                    name="strategy"
                    value={formData.strategy}
                    onChange={handleChange}
                    list="strategies-list"
                    placeholder="Select or type..."
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  />
                  <datalist id="strategies-list">
                    {settings.strategies.map(strategy => (
                      <option key={strategy} value={strategy} />
                    ))}
                  </datalist>
                </div>

                {/* Emotion */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Emotion</label>
                  <select
                    name="emotion"
                    value={formData.emotion}
                    onChange={handleChange}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  >
                    <option value="Calm">Calm</option>
                    <option value="Fear">Fear</option>
                    <option value="Greed">Greed</option>
                    <option value="Hesitant">Hesitant</option>
                    <option value="Overconfident">Overconfident</option>
                    <option value="Revenge">Revenge</option>
                  </select>
                </div>

                {/* Trade Quality */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Trade Quality: {formData.tradeQuality}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    name="tradeQuality"
                    value={formData.tradeQuality}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Calculated Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-dark-bg rounded-lg border border-dark-border">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Profit/Loss</label>
                  <p className={`text-2xl font-bold ${(formData.profitLoss || 0) >= 0 ? 'text-profit' : 'text-loss'}`}>
                    {formatPnLWithSign(formData.profitLoss || 0, formData.market)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Risk:Reward Ratio</label>
                  <p className="text-2xl font-bold text-gold-500">
                    1:{Number(formData.rr || 0).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Rule Followed */}
              <div className="mb-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="ruleFollowed"
                    checked={formData.ruleFollowed}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-dark-border bg-dark-bg text-gold-500 focus:ring-2 focus:ring-gold-500"
                  />
                  <span className="text-gray-300 font-medium">I followed my trading rules</span>
                </label>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Notes / Mistakes / Lessons
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  placeholder="What did you learn from this trade? Any mistakes or key observations?"
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {trade ? 'Update Trade' : 'Add Trade'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default TradeModal;
