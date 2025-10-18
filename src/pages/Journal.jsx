import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import TradeModal from '../components/TradeModal';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Copy,
  Calendar,
  Download
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Journal = () => {
  const { trades, deleteTrade, addTrade } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    pair: '',
    direction: '',
    emotion: '',
    strategy: '',
    ruleFollowed: '',
  });

  // Filter trades
  const filteredTrades = useMemo(() => {
    return trades.filter(trade => {
      const matchesSearch = 
        trade.pair.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.strategy.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPair = !filters.pair || trade.pair === filters.pair;
      const matchesDirection = !filters.direction || trade.direction === filters.direction;
      const matchesEmotion = !filters.emotion || trade.emotion === filters.emotion;
      const matchesStrategy = !filters.strategy || trade.strategy === filters.strategy;
      const matchesRules = filters.ruleFollowed === '' || 
        trade.ruleFollowed.toString() === filters.ruleFollowed;

      return matchesSearch && matchesPair && matchesDirection && 
             matchesEmotion && matchesStrategy && matchesRules;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [trades, searchTerm, filters]);

  const handleEdit = (trade) => {
    setSelectedTrade(trade);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      await deleteTrade(id);
    }
  };

  const handleDuplicate = async (trade) => {
    const newTrade = {
      ...trade,
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
    };
    await addTrade(newTrade);
    toast.success('Trade duplicated!');
  };

  const handleAddNew = () => {
    setSelectedTrade(null);
    setIsModalOpen(true);
  };

  const resetFilters = () => {
    setFilters({
      pair: '',
      direction: '',
      emotion: '',
      strategy: '',
      ruleFollowed: '',
    });
    setSearchTerm('');
  };

  // Get unique values for filters
  const uniquePairs = [...new Set(trades.map(t => t.pair))];
  const uniqueStrategies = [...new Set(trades.map(t => t.strategy).filter(s => s))];
  const emotions = ['Calm', 'Fear', 'Greed', 'Hesitant', 'Overconfident', 'Revenge'];

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Trade Journal</h1>
          <p className="text-gray-400">Log and manage all your trades</p>
        </div>
        <button
          onClick={handleAddNew}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Trade</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by pair, strategy, or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Pair Filter */}
          <div>
            <select
              value={filters.pair}
              onChange={(e) => setFilters({ ...filters, pair: e.target.value })}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            >
              <option value="">All Pairs</option>
              {uniquePairs.map(pair => (
                <option key={pair} value={pair}>{pair}</option>
              ))}
            </select>
          </div>

          {/* Direction Filter */}
          <div>
            <select
              value={filters.direction}
              onChange={(e) => setFilters({ ...filters, direction: e.target.value })}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            >
              <option value="">All Directions</option>
              <option value="Buy">Buy</option>
              <option value="Sell">Sell</option>
            </select>
          </div>

          {/* Emotion Filter */}
          <div>
            <select
              value={filters.emotion}
              onChange={(e) => setFilters({ ...filters, emotion: e.target.value })}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            >
              <option value="">All Emotions</option>
              {emotions.map(emotion => (
                <option key={emotion} value={emotion}>{emotion}</option>
              ))}
            </select>
          </div>

          {/* Strategy Filter */}
          <div>
            <select
              value={filters.strategy}
              onChange={(e) => setFilters({ ...filters, strategy: e.target.value })}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            >
              <option value="">All Strategies</option>
              {uniqueStrategies.map(strategy => (
                <option key={strategy} value={strategy}>{strategy}</option>
              ))}
            </select>
          </div>

          {/* Rules Filter */}
          <div>
            <select
              value={filters.ruleFollowed}
              onChange={(e) => setFilters({ ...filters, ruleFollowed: e.target.value })}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            >
              <option value="">Rules: All</option>
              <option value="true">Rules Followed</option>
              <option value="false">Rules Broken</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing {filteredTrades.length} of {trades.length} trades
          </p>
          <button
            onClick={resetFilters}
            className="text-sm text-gold-500 hover:text-gold-600 font-medium"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Trades List */}
      <div className="space-y-4">
        {filteredTrades.length === 0 ? (
          <div className="bg-dark-card border border-dark-border rounded-xl p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No trades found</h3>
            <p className="text-gray-400 mb-6">
              {trades.length === 0 
                ? "Start logging your trades to build your journal" 
                : "Try adjusting your filters"}
            </p>
            <button onClick={handleAddNew} className="btn-primary">
              Add Your First Trade
            </button>
          </div>
        ) : (
          filteredTrades.map((trade, index) => (
            <motion.div
              key={trade.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-gold-500/30 transition-all card-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-2 h-16 rounded ${trade.profitLoss >= 0 ? 'bg-profit' : 'bg-loss'}`} />
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{trade.pair}</h3>
                      <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                        trade.direction === 'Buy' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {trade.direction}
                      </span>
                      {!trade.ruleFollowed && (
                        <span className="px-3 py-1 rounded-lg text-sm font-semibold bg-yellow-500/20 text-yellow-400">
                          Rules Broken
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      {format(new Date(trade.date), 'EEEE, MMMM dd, yyyy')} • {trade.session} Session
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDuplicate(trade)}
                    className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
                    title="Duplicate trade"
                  >
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleEdit(trade)}
                    className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
                    title="Edit trade"
                  >
                    <Edit2 className="w-4 h-4 text-gold-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(trade.id)}
                    className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
                    title="Delete trade"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Entry</p>
                  <p className="text-sm font-semibold text-white">{trade.entry}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Exit</p>
                  <p className="text-sm font-semibold text-white">{trade.exit}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">P/L</p>
                  <p className={`text-sm font-bold ${trade.profitLoss >= 0 ? 'text-profit' : 'text-loss'}`}>
                    {trade.profitLoss >= 0 ? '+' : ''}{trade.profitLoss.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">R:R</p>
                  <p className="text-sm font-semibold text-gold-500">1:{trade.rr.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Emotion</p>
                  <p className="text-sm font-semibold text-white">{trade.emotion}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Quality</p>
                  <p className="text-sm font-semibold text-white">{trade.tradeQuality}/10</p>
                </div>
              </div>

              {trade.strategy && (
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium">
                    Strategy: {trade.strategy}
                  </span>
                </div>
              )}

              {trade.notes && (
                <div className="bg-dark-bg rounded-lg p-4 border border-dark-border">
                  <p className="text-sm text-gray-400 font-medium mb-2">Notes:</p>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{trade.notes}</p>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Trade Modal */}
      <TradeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTrade(null);
        }}
        trade={selectedTrade}
      />
    </div>
  );
};

export default Journal;
