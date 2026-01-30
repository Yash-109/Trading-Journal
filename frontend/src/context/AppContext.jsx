import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { tradesAPI, reflectionsAPI, rulesAPI } from '../services/api';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [trades, setTrades] = useState([]);
  const [reflections, setReflections] = useState([]);
  const [rules, setRules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    theme: 'dark',
    defaultCurrency: 'USD',
    strategies: ['Breakout', 'Retest', 'Supply/Demand', 'Smart Money', 'ICT', 'Scalping'],
    pairs: ['XAUUSD', 'BTCUSD', 'EURUSD', 'GBPUSD', 'US30', 'NAS100'],
  });

  // Load data from backend when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    } else {
      // Clear data on logout
      setTrades([]);
      setReflections([]);
      setRules([]);
    }
  }, [isAuthenticated]);

  /**
   * Load all data from backend
   */
  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [tradesData, reflectionsData, rulesData] = await Promise.all([
        tradesAPI.getAll(),
        reflectionsAPI.getAll(),
        rulesAPI.getAll(),
      ]);

      setTrades(Array.isArray(tradesData) ? tradesData : []);
      setReflections(Array.isArray(reflectionsData) ? reflectionsData : []);
      setRules(Array.isArray(rulesData) ? rulesData : []);
    } catch (error) {
      console.error('Failed to load data:', error);
      // Don't show error toast on 401 - it's handled by API service
      if (!error.message?.includes('Unauthorized')) {
        toast.error('Failed to load data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Trade CRUD operations
  const addTrade = async (trade) => {
    try {
      const newTrade = await tradesAPI.create(trade);
      if (newTrade) {
        setTrades(prevTrades => [...(prevTrades || []), newTrade]);
        toast.success('Trade added successfully!');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to add trade:', error);
      toast.error(error.message || 'Failed to add trade');
      return false;
    }
  };

  const updateTrade = async (trade) => {
    try {
      const updatedTrade = await tradesAPI.update(trade._id || trade.id, trade);
      if (updatedTrade) {
        setTrades(prevTrades => (prevTrades || []).map(t => (t._id || t.id) === (trade._id || trade.id) ? updatedTrade : t));
        toast.success('Trade updated successfully!');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update trade:', error);
      toast.error(error.message || 'Failed to update trade');
      return false;
    }
  };

  const deleteTrade = async (id) => {
    try {
      await tradesAPI.delete(id);
      setTrades(prevTrades => (prevTrades || []).filter(t => (t._id || t.id) !== id));
      toast.success('Trade deleted successfully!');
      return true;
    } catch (error) {
      console.error('Failed to delete trade:', error);
      toast.error(error.message || 'Failed to delete trade');
      return false;
    }
  };

  // Reflection CRUD operations
  const addReflection = async (reflection) => {
    try {
      const newReflection = await reflectionsAPI.create(reflection);
      setReflections([...reflections.filter(r => r.date !== reflection.date), newReflection]);
      toast.success('Reflection saved successfully!');
      return true;
    } catch (error) {
      console.error('Failed to save reflection:', error);
      toast.error(error.message || 'Failed to save reflection');
      return false;
    }
  };

  const deleteReflection = async (id) => {
    try {
      await reflectionsAPI.delete(id);
      setReflections(reflections.filter(r => (r._id || r.id) !== id));
      toast.success('Reflection deleted successfully!');
      return true;
    } catch (error) {
      console.error('Failed to delete reflection:', error);
      toast.error(error.message || 'Failed to delete reflection');
      return false;
    }
  };

  // Rule CRUD operations
  const addRule = async (rule) => {
    try {
      // TODO: Replace with API call
      // const response = await fetch('/api/rules', { method: 'POST', body: JSON.stringify(rule) });
      const newRule = await rulesAPI.create(rule);
      setRules([...rules, newRule]);
      toast.success('Rule added successfully!');
      return true;
    } catch (error) {
      console.error('Failed to add rule:', error);
      toast.error(error.message || 'Failed to add rule');
      return false;
    }
  };

  const updateRule = async (rule) => {
    try {
      const updatedRule = await rulesAPI.update(rule._id || rule.id, rule);
      setRules(rules.map(r => (r._id || r.id) === (rule._id || rule.id) ? updatedRule : r));
      return true;
    } catch (error) {
      console.error('Failed to update rule:', error);
      toast.error(error.message || 'Failed to update rule');
      return false;
    }
  };

  const deleteRule = async (id) => {
    try {
      await rulesAPI.delete(id);
      setRules(rules.filter(r => (r._id || r.id) !== id));
      toast.success('Rule deleted successfully!');
      return true;
    } catch (error) {
      console.error('Failed to delete rule:', error);
      toast.error(error.message || 'Failed to delete rule');
      return false;
    }
  };

  // Settings operations
  const updateSettings = async (newSettings) => {
    try {
      // Settings are stored locally for now
      setSettings(newSettings);
      localStorage.setItem('settings', JSON.stringify(newSettings));
      toast.success('Settings updated successfully!');
      return true;
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast.error('Failed to update settings');
      return false;
    }
  };

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }, []);

  // Export data
  const exportData = () => {
    const data = {
      trades,
      reflections,
      rules,
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trading-journal-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully!');
  };

  // Import data
  const importData = async (file) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // Import trades
      if (data.trades && Array.isArray(data.trades)) {
        for (const trade of data.trades) {
          await tradesAPI.create(trade);
        }
      }

      // Import reflections
      if (data.reflections && Array.isArray(data.reflections)) {
        for (const reflection of data.reflections) {
          await reflectionsAPI.create(reflection);
        }
      }

      // Import rules
      if (data.rules && Array.isArray(data.rules)) {
        for (const rule of data.rules) {
          await rulesAPI.create(rule);
        }
      }

      // Import settings
      if (data.settings) {
        setSettings(data.settings);
        localStorage.setItem('settings', JSON.stringify(data.settings));
      }

      // Reload all data
      await loadAllData();

      toast.success('Data imported successfully!');
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      toast.error('Failed to import data');
      return false;
    }
  };

  const value = {
    trades,
    reflections,
    rules,
    settings,
    isLoading,
    addTrade,
    updateTrade,
    deleteTrade,
    addReflection,
    deleteReflection,
    addRule,
    updateRule,
    deleteRule,
    updateSettings,
    exportData,
    importData,
    loadAllData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
