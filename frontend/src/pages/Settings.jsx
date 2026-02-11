import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { 
  Moon, 
  Download, 
  Upload, 
  Trash2, 
  Plus,
  Minus,
  Save,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const { settings, updateSettings, exportData, importData } = useApp();
  const [localSettings, setLocalSettings] = useState(settings);
  const [newPair, setNewPair] = useState('');
  const [newStrategy, setNewStrategy] = useState('');
  const [isDangerZoneOpen, setIsDangerZoneOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const fileInputRef = useRef(null);

  const handleSave = async () => {
    await updateSettings(localSettings);
    toast.success('Settings saved successfully');
  };

  const handleAddPair = () => {
    if (newPair.trim() && !localSettings.pairs.includes(newPair.trim().toUpperCase())) {
      setLocalSettings({
        ...localSettings,
        pairs: [...localSettings.pairs, newPair.trim().toUpperCase()],
      });
      setNewPair('');
    }
  };

  const handleRemovePair = (pair) => {
    setLocalSettings({
      ...localSettings,
      pairs: localSettings.pairs.filter(p => p !== pair),
    });
  };

  const handleAddStrategy = () => {
    if (newStrategy.trim() && !localSettings.strategies.includes(newStrategy.trim())) {
      setLocalSettings({
        ...localSettings,
        strategies: [...localSettings.strategies, newStrategy.trim()],
      });
      setNewStrategy('');
    }
  };

  const handleRemoveStrategy = (strategy) => {
    setLocalSettings({
      ...localSettings,
      strategies: localSettings.strategies.filter(s => s !== strategy),
    });
  };

  const handleExport = () => {
    exportData();
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const success = await importData(file);
      if (success) {
        window.location.reload(); // Reload to show imported data
      }
    }
  };

  const handleClearAllData = () => {
    setShowDeleteModal(true);
  };

  const confirmClearAllData = () => {
    if (deleteConfirmText === 'DELETE') {
      // TODO: Implement clear all data via backend API
      localStorage.clear();
      toast.success('All data cleared. Reloading...');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      toast.error('Please type DELETE to confirm');
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteConfirmText('');
  };

  return (
    <div className="space-y-6 animate-slide-in max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Configure your trading journal</p>
      </div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-card border border-dark-border rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold text-white mb-6">Appearance</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-white font-medium">Theme</p>
            <div className="flex items-center space-x-2 bg-dark-bg rounded-lg p-1">
              <button
                onClick={() => setLocalSettings({ ...localSettings, theme: 'dark' })}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors bg-gold-500 text-black"
              >
                <Moon className="w-4 h-4" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-dark-border">
            <div>
              <p className="text-white font-medium">Account Currency</p>
              <p className="text-xs text-gray-500 mt-1">Currency used for P/L display across all panels</p>
            </div>
            <select
              value={localSettings.defaultCurrency}
              onChange={(e) => setLocalSettings({ ...localSettings, defaultCurrency: e.target.value })}
              className="bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            >
              <option value="USD">USD ($)</option>
              <option value="INR">INR (₹)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Trading Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-dark-card border border-dark-border rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold text-white mb-6">Trading Configuration</h2>
        
        {/* Trading Pairs */}
        <div className="mb-6">
          <p className="text-white font-medium mb-3">Trading Pairs</p>
          <div className="mb-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newPair}
                onChange={(e) => setNewPair(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleAddPair()}
                placeholder="e.g., XAUUSD"
                className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              />
              <button onClick={handleAddPair} className="btn-primary">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {localSettings.pairs.map((pair) => (
              <div
                key={pair}
                className="flex items-center space-x-2 bg-dark-bg border border-dark-border rounded-lg px-3 py-2"
              >
                <span className="text-white font-medium">{pair}</span>
                <button
                  onClick={() => handleRemovePair(pair)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Trading Strategies */}
        <div className="pt-6 border-t border-dark-border">
          <p className="text-white font-medium mb-3">Trading Strategies</p>
          <div className="mb-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newStrategy}
                onChange={(e) => setNewStrategy(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddStrategy()}
                placeholder="e.g., Breakout"
                className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              />
              <button onClick={handleAddStrategy} className="btn-primary">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {localSettings.strategies.map((strategy) => (
              <div
                key={strategy}
                className="flex items-center space-x-2 bg-dark-bg border border-dark-border rounded-lg px-3 py-2"
              >
                <span className="text-white font-medium">{strategy}</span>
                <button
                  onClick={() => handleRemoveStrategy(strategy)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Backup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-dark-card border border-dark-border rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold text-white mb-6">Backup</h2>
        
        <div className="space-y-3">
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center space-x-2 bg-gold-500 hover:bg-gold-600 text-black font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Download Backup (JSON)</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center space-x-2 bg-dark-bg hover:bg-dark-bg/80 border border-dark-border text-white font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Backup</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-dark-card border border-red-500/20 rounded-xl overflow-hidden"
      >
        <button
          onClick={() => setIsDangerZoneOpen(!isDangerZoneOpen)}
          className="w-full flex items-center justify-between p-6 hover:bg-red-500/5 transition-colors"
        >
          <h2 className="text-xl font-semibold text-red-400">Danger Zone</h2>
          {isDangerZoneOpen ? (
            <ChevronDown className="w-5 h-5 text-red-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-red-400" />
          )}
        </button>
        
        {isDangerZoneOpen && (
          <div className="px-6 pb-6">
            <button
              onClick={handleClearAllData}
              className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span>Clear All Data</span>
            </button>
          </div>
        )}
      </motion.div>

      {/* Save Button */}
      <div className="flex items-center justify-end space-x-3">
        <button
          onClick={() => setLocalSettings(settings)}
          className="btn-secondary"
        >
          Reset
        </button>
        <button onClick={handleSave} className="btn-primary flex items-center space-x-2">
          <Save className="w-5 h-5" />
          <span>Save Settings</span>
        </button>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-dark-card border border-dark-border rounded-xl p-6 text-center"
      >
        <h2 className="text-2xl font-bold text-gold-500 mb-2">Trading Journal Pro+</h2>
        <p className="text-gray-400 mb-2">Version 1.0.0</p>
        <p className="text-sm text-gray-500">All data stored locally</p>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-card border border-red-500/50 rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-red-400 mb-4">⚠️ Confirm Data Deletion</h3>
            <p className="text-gray-300 mb-4">
              This will permanently delete ALL your data including trades, reflections, and rules. This action cannot be undone.
            </p>
            <p className="text-white mb-4">
              Type <span className="font-bold text-red-400">DELETE</span> to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
            />
            <div className="flex space-x-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 bg-dark-bg hover:bg-dark-bg/80 border border-dark-border text-white font-semibold px-4 py-2.5 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmClearAllData}
                disabled={deleteConfirmText !== 'DELETE'}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white font-semibold px-4 py-2.5 rounded-lg transition-colors"
              >
                Delete All Data
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Settings;
