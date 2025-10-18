import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { 
  Moon, 
  Sun, 
  Download, 
  Upload, 
  Trash2, 
  Plus,
  Minus,
  Save,
  AlertCircle,
  HardDrive,
  Cloud,
  Wifi,
  WifiOff
} from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const { settings, updateSettings, exportData, importData, saveToLocal, loadFromLocal, trades, reflections, rules } = useApp();
  const [localSettings, setLocalSettings] = useState(settings);
  const [newPair, setNewPair] = useState('');
  const [newStrategy, setNewStrategy] = useState('');
  const [lastSaved, setLastSaved] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const fileInputRef = useRef(null);

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Get last saved time
  useEffect(() => {
    const savedTime = localStorage.getItem('lastSaved');
    if (savedTime) {
      setLastSaved(new Date(savedTime));
    }
  }, []);

  const handleSave = async () => {
    await updateSettings(localSettings);
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

  const handleSaveLocal = async () => {
    const success = await saveToLocal();
    if (success) {
      setLastSaved(new Date());
    }
  };

  const handleLoadLocal = async () => {
    if (window.confirm('This will replace your current data with saved local data. Continue?')) {
      const success = await loadFromLocal();
      if (success) {
        setTimeout(() => window.location.reload(), 1000);
      }
    }
  };

  const handleClearAllData = () => {
    if (window.confirm('⚠️ WARNING: This will delete ALL your data including trades, reflections, and rules. This action cannot be undone. Are you absolutely sure?')) {
      if (window.confirm('This is your final warning. All data will be permanently deleted. Continue?')) {
        // Clear IndexedDB
        indexedDB.deleteDatabase('TradingJournalDB');
        toast.success('All data cleared. Reloading...');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    }
  };

  const dataStats = {
    trades: trades.length,
    reflections: reflections.length,
    rules: rules.length,
    totalSize: new Blob([JSON.stringify({ trades, reflections, rules })]).size,
  };

  return (
    <div className="space-y-6 animate-slide-in max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Customize your trading journal experience</p>
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
            <div>
              <p className="text-white font-medium">Theme</p>
              <p className="text-sm text-gray-400">Choose your preferred color scheme</p>
            </div>
            <div className="flex items-center space-x-2 bg-dark-bg rounded-lg p-1">
              <button
                onClick={() => setLocalSettings({ ...localSettings, theme: 'dark' })}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  localSettings.theme === 'dark'
                    ? 'bg-gold-500 text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Dark</span>
              </button>
              <button
                onClick={() => setLocalSettings({ ...localSettings, theme: 'light' })}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  localSettings.theme === 'light'
                    ? 'bg-gold-500 text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
                disabled
              >
                <Sun className="w-4 h-4" />
                <span>Light (Coming Soon)</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-dark-border">
            <div>
              <p className="text-white font-medium">Default Currency</p>
              <p className="text-sm text-gray-400">Currency used for P/L calculations</p>
            </div>
            <select
              value={localSettings.defaultCurrency}
              onChange={(e) => setLocalSettings({ ...localSettings, defaultCurrency: e.target.value })}
              className="bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Trading Pairs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-dark-card border border-dark-border rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold text-white mb-6">Trading Pairs</h2>
        
        <div className="mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newPair}
              onChange={(e) => setNewPair(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleAddPair()}
              placeholder="Add new pair (e.g., XAUUSD)"
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
      </motion.div>

      {/* Strategies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-dark-card border border-dark-border rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold text-white mb-6">Trading Strategies</h2>
        
        <div className="mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newStrategy}
              onChange={(e) => setNewStrategy(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddStrategy()}
              placeholder="Add new strategy (e.g., Breakout)"
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
      </motion.div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-dark-card border border-dark-border rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Data Management</h2>
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <div className="flex items-center space-x-2 text-green-400 text-sm">
                <Wifi className="w-4 h-4" />
                <span>Online</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-yellow-400 text-sm">
                <WifiOff className="w-4 h-4" />
                <span>Offline</span>
              </div>
            )}
          </div>
        </div>

        {/* Last Saved Info */}
        {lastSaved && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-green-400">
              <Save className="w-4 h-4" />
              <span>Last saved: {lastSaved.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Data Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-dark-bg rounded-lg p-4 border border-dark-border">
            <p className="text-gray-400 text-sm mb-1">Trades</p>
            <p className="text-2xl font-bold text-white">{dataStats.trades}</p>
          </div>
          <div className="bg-dark-bg rounded-lg p-4 border border-dark-border">
            <p className="text-gray-400 text-sm mb-1">Reflections</p>
            <p className="text-2xl font-bold text-white">{dataStats.reflections}</p>
          </div>
          <div className="bg-dark-bg rounded-lg p-4 border border-dark-border">
            <p className="text-gray-400 text-sm mb-1">Rules</p>
            <p className="text-2xl font-bold text-white">{dataStats.rules}</p>
          </div>
          <div className="bg-dark-bg rounded-lg p-4 border border-dark-border">
            <p className="text-gray-400 text-sm mb-1">Data Size</p>
            <p className="text-2xl font-bold text-white">
              {(dataStats.totalSize / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Local Storage Actions */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-semibold text-blue-400 mb-3 flex items-center space-x-2">
              <HardDrive className="w-4 h-4" />
              <span>Local Storage (This Device)</span>
            </h3>
            <div className="space-y-2">
              <button
                onClick={handleSaveLocal}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors"
              >
                <Save className="w-5 h-5" />
                <span>Save Data Locally</span>
              </button>
              <button
                onClick={handleLoadLocal}
                className="w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors"
              >
                <Upload className="w-5 h-5" />
                <span>Load Local Data</span>
              </button>
            </div>
          </div>

          {/* File Export/Import */}
          <div className="bg-gold-500/10 border border-gold-500/20 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-semibold text-gold-400 mb-3 flex items-center space-x-2">
              <Cloud className="w-4 h-4" />
              <span>File Backup (Transfer Between Devices)</span>
            </h3>
            <div className="space-y-2">
              <button
                onClick={handleExport}
                className="w-full flex items-center justify-center space-x-2 bg-gold-500 hover:bg-gold-600 text-black font-semibold px-4 py-2.5 rounded-lg transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Download Backup File (JSON)</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center space-x-2 bg-gold-600 hover:bg-gold-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors"
              >
                <Upload className="w-5 h-5" />
                <span>Upload Backup File</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-red-400 mb-3">⚠️ Danger Zone</h3>
            <button
              onClick={handleClearAllData}
              className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span>Clear All Data</span>
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-300">
                <p className="font-semibold text-yellow-400 mb-1">💾 Backup Strategy</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li><strong>Local Save:</strong> Quick save on this device only</li>
                  <li><strong>File Download:</strong> Download backup to transfer to phone/other laptop</li>
                  <li><strong>Auto-Save:</strong> Data auto-saves every 5 minutes</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-300">
                <p className="font-semibold text-blue-400 mb-1">📱 Using on Multiple Devices</p>
                <ol className="list-decimal list-inside space-y-1 mt-2">
                  <li>On Laptop: Click "Download Backup File"</li>
                  <li>Transfer file to Phone (email/cloud/USB)</li>
                  <li>On Phone: Open app → Settings → "Upload Backup File"</li>
                  <li>Your data is now synced!</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
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

      {/* About */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-dark-card border border-dark-border rounded-xl p-6 text-center"
      >
        <h2 className="text-2xl font-bold text-gold-500 mb-2">Trading Journal Pro+</h2>
        <p className="text-gray-400 mb-4">Version 1.0.0</p>
        <p className="text-sm text-gray-500">
          Built by Aryan Patel for professional traders
        </p>
        <p className="text-xs text-gray-600 mt-2">
          All data is stored locally in your browser
        </p>
      </motion.div>
    </div>
  );
};

export default Settings;
