import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';

const Rules = () => {
  const { rules = [], addRule, updateRule, deleteRule, trades = [] } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [ruleTitle, setRuleTitle] = useState('');
  const [ruleDescription, setRuleDescription] = useState('');

  // Calculate rule compliance stats
  const ruleStats = {
    totalTrades: trades.length,
    rulesFollowed: trades.filter(t => t.ruleFollowed).length,
    rulesBroken: trades.filter(t => !t.ruleFollowed).length,
    complianceRate: trades.length > 0 
      ? Number(((trades.filter(t => t.ruleFollowed).length / trades.length) * 100) || 0).toFixed(1)
      : '0.0',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ruleTitle.trim()) return;

    if (editingRule) {
      await updateRule({ 
        ...editingRule, 
        title: ruleTitle,
        description: ruleDescription 
      });
    } else {
      await addRule({
        title: ruleTitle,
        description: ruleDescription,
      });
    }

    setRuleTitle('');
    setRuleDescription('');
    setIsModalOpen(false);
    setEditingRule(null);
  };

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setRuleTitle(rule.title || '');
    setRuleDescription(rule.description || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      await deleteRule(id);
    }
  };

  // Note: Active toggle removed as backend doesn't support active field
  // If needed, this feature can be added to backend Rule model

  const handleAddNew = () => {
    setEditingRule(null);
    setRuleTitle('');
    setRuleDescription('');
    setIsModalOpen(true);
  };

  // Default trading rules suggestions
  const suggestedRules = [
    "Never risk more than 1-2% of my account per trade",
    "Always wait for confirmation before entering a trade",
    "Set stop loss before entering any position",
    "Take profit at predetermined levels",
    "Do not overtrade - maximum 3 trades per day",
    "Never trade based on emotions or revenge",
    "Follow my trading plan strictly",
    "Review all trades at end of day",
    "Take a break after 2 consecutive losses",
    "Only trade during my designated session times",
  ];

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Trading Rules</h1>
          <p className="text-gray-400">Define and track your trading discipline</p>
        </div>
        <button onClick={handleAddNew} className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Rule</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-card border border-dark-border rounded-xl p-6"
        >
          <p className="text-gray-400 text-sm mb-2">Total Rules</p>
          <p className="text-3xl font-bold text-white">{rules.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-card border border-dark-border rounded-xl p-6"
        >
          <p className="text-gray-400 text-sm mb-2">Total Trades</p>
          <p className="text-3xl font-bold text-gold-500">
            {ruleStats.totalTrades}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-card border border-dark-border rounded-xl p-6"
        >
          <p className="text-gray-400 text-sm mb-2">Compliance Rate</p>
          <p className={`text-3xl font-bold ${
            ruleStats.complianceRate >= 80 ? 'text-profit' : 
            ruleStats.complianceRate >= 60 ? 'text-gold-500' : 'text-loss'
          }`}>
            {ruleStats.complianceRate}%
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-dark-card border border-dark-border rounded-xl p-6"
        >
          <p className="text-gray-400 text-sm mb-2">Rules Broken</p>
          <p className="text-3xl font-bold text-loss">{ruleStats.rulesBroken}</p>
        </motion.div>
      </div>

      {/* Compliance Alert */}
      {ruleStats.complianceRate < 70 && ruleStats.totalTrades > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-xl p-6"
        >
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-yellow-500 mt-1" />
            <div>
              <h3 className="text-yellow-400 font-semibold mb-2">Low Rule Compliance Detected</h3>
              <p className="text-gray-300">
                Your rule compliance rate is below 70%. Focus on following your trading rules to improve consistency and reduce emotional trading.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* My Rules */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">My Trading Rules</h2>
        
        {rules.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Rules Yet</h3>
            <p className="text-gray-400 mb-6">Create your rulebook to maintain discipline</p>
            <button onClick={handleAddNew} className="btn-primary">
              Create First Rule
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {rules.map((rule, index) => (
              <motion.div
                key={rule._id || rule.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start space-x-4 p-4 rounded-lg border bg-dark-bg border-gold-500/30 hover:border-gold-500/50 transition-all"
              >
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-white mb-1">
                    {rule.title}
                  </h3>
                  {rule.description && (
                    <p className="text-sm text-gray-400">
                      {rule.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(rule)}
                    className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-gray-400 hover:text-gold-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(rule._id || rule.id)}
                    className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Suggested Rules */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Suggested Rules</h2>
        <p className="text-gray-400 mb-6">Click to add to your rulebook</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestedRules.map((suggestion, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                setRuleTitle(suggestion);
                setRuleDescription('');
                setIsModalOpen(true);
              }}
              className="text-left p-4 bg-dark-bg border border-dark-border rounded-lg hover:border-gold-500/30 transition-all group"
            >
              <div className="flex items-start space-x-3">
                <Plus className="w-4 h-4 text-gray-500 group-hover:text-gold-500 mt-1 flex-shrink-0" />
                <p className="text-sm text-gray-300 group-hover:text-white">{suggestion}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 transition-opacity modal-backdrop"
                onClick={() => setIsModalOpen(false)}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-dark-card rounded-xl shadow-2xl transform transition-all sm:max-w-lg sm:w-full border border-dark-border"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-dark-border">
                  <h2 className="text-xl font-bold text-white">
                    {editingRule ? 'Edit Rule' : 'Add New Rule'}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 rounded-lg hover:bg-dark-hover transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Rule Title *
                    </label>
                    <input
                      type="text"
                      value={ruleTitle}
                      onChange={(e) => setRuleTitle(e.target.value)}
                      placeholder="Enter rule title..."
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      required
                      autoFocus
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={ruleDescription}
                      onChange={(e) => setRuleDescription(e.target.value)}
                      placeholder="Add additional details about this rule..."
                      rows="3"
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      {editingRule ? 'Update Rule' : 'Add Rule'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Rules;
