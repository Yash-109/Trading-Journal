import React, { createContext, useContext, useState, useEffect } from 'react';
import { openDB } from 'idb';
import toast from 'react-hot-toast';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

const DB_NAME = 'TradingJournalDB';
const DB_VERSION = 1;

export const AppProvider = ({ children }) => {
  const [trades, setTrades] = useState([]);
  const [reflections, setReflections] = useState([]);
  const [rules, setRules] = useState([]);
  const [settings, setSettings] = useState({
    theme: 'dark',
    defaultCurrency: 'USD',
    strategies: ['Breakout', 'Retest', 'Supply/Demand', 'Smart Money', 'ICT', 'Scalping'],
    pairs: ['XAUUSD', 'BTCUSD', 'EURUSD', 'GBPUSD', 'US30', 'NAS100'],
  });
  const [db, setDb] = useState(null);

  // Initialize IndexedDB
  useEffect(() => {
    const initDB = async () => {
      try {
        const database = await openDB(DB_NAME, DB_VERSION, {
          upgrade(db) {
            if (!db.objectStoreNames.contains('trades')) {
              db.createObjectStore('trades', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('reflections')) {
              db.createObjectStore('reflections', { keyPath: 'date' });
            }
            if (!db.objectStoreNames.contains('rules')) {
              db.createObjectStore('rules', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('settings')) {
              db.createObjectStore('settings', { keyPath: 'key' });
            }
          },
        });
        setDb(database);
        loadData(database);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        toast.error('Failed to initialize database');
      }
    };
    initDB();
  }, []);

  const loadData = async (database) => {
    try {
      const tradesData = await database.getAll('trades');
      const reflectionsData = await database.getAll('reflections');
      const rulesData = await database.getAll('rules');
      const settingsData = await database.get('settings', 'appSettings');

      setTrades(tradesData || []);
      setReflections(reflectionsData || []);
      setRules(rulesData || []);
      if (settingsData) {
        setSettings(settingsData.value);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  // Trade CRUD operations
  const addTrade = async (trade) => {
    try {
      await db.put('trades', trade);
      setTrades([...trades, trade]);
      toast.success('Trade added successfully!');
      return true;
    } catch (error) {
      console.error('Failed to add trade:', error);
      toast.error('Failed to add trade');
      return false;
    }
  };

  const updateTrade = async (trade) => {
    try {
      await db.put('trades', trade);
      setTrades(trades.map(t => t.id === trade.id ? trade : t));
      toast.success('Trade updated successfully!');
      return true;
    } catch (error) {
      console.error('Failed to update trade:', error);
      toast.error('Failed to update trade');
      return false;
    }
  };

  const deleteTrade = async (id) => {
    try {
      await db.delete('trades', id);
      setTrades(trades.filter(t => t.id !== id));
      toast.success('Trade deleted successfully!');
      return true;
    } catch (error) {
      console.error('Failed to delete trade:', error);
      toast.error('Failed to delete trade');
      return false;
    }
  };

  // Reflection CRUD operations
  const addReflection = async (reflection) => {
    try {
      await db.put('reflections', reflection);
      setReflections([...reflections.filter(r => r.date !== reflection.date), reflection]);
      toast.success('Reflection saved successfully!');
      return true;
    } catch (error) {
      console.error('Failed to save reflection:', error);
      toast.error('Failed to save reflection');
      return false;
    }
  };

  const deleteReflection = async (date) => {
    try {
      await db.delete('reflections', date);
      setReflections(reflections.filter(r => r.date !== date));
      toast.success('Reflection deleted successfully!');
      return true;
    } catch (error) {
      console.error('Failed to delete reflection:', error);
      toast.error('Failed to delete reflection');
      return false;
    }
  };

  // Rule CRUD operations
  const addRule = async (rule) => {
    try {
      await db.put('rules', rule);
      setRules([...rules, rule]);
      toast.success('Rule added successfully!');
      return true;
    } catch (error) {
      console.error('Failed to add rule:', error);
      toast.error('Failed to add rule');
      return false;
    }
  };

  const updateRule = async (rule) => {
    try {
      await db.put('rules', rule);
      setRules(rules.map(r => r.id === rule.id ? rule : r));
      return true;
    } catch (error) {
      console.error('Failed to update rule:', error);
      toast.error('Failed to update rule');
      return false;
    }
  };

  const deleteRule = async (id) => {
    try {
      await db.delete('rules', id);
      setRules(rules.filter(r => r.id !== id));
      toast.success('Rule deleted successfully!');
      return true;
    } catch (error) {
      console.error('Failed to delete rule:', error);
      toast.error('Failed to delete rule');
      return false;
    }
  };

  // Settings operations
  const updateSettings = async (newSettings) => {
    try {
      await db.put('settings', { key: 'appSettings', value: newSettings });
      setSettings(newSettings);
      toast.success('Settings updated successfully!');
      return true;
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast.error('Failed to update settings');
      return false;
    }
  };

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
    
    // Also save to localStorage as backup
    localStorage.setItem('tradingJournalBackup', dataStr);
    localStorage.setItem('tradingJournalBackupDate', new Date().toISOString());
  };

  // Save data manually (localStorage)
  const saveToLocal = () => {
    try {
      const data = {
        trades,
        reflections,
        rules,
        settings,
        saveDate: new Date().toISOString(),
      };
      localStorage.setItem('tradingJournalData', JSON.stringify(data));
      localStorage.setItem('lastSaved', new Date().toISOString());
      toast.success('Data saved locally!');
      return true;
    } catch (error) {
      console.error('Failed to save locally:', error);
      toast.error('Failed to save data locally');
      return false;
    }
  };

  // Load from localStorage
  const loadFromLocal = async () => {
    try {
      const dataStr = localStorage.getItem('tradingJournalData');
      if (!dataStr) {
        toast.error('No local data found');
        return false;
      }

      const data = JSON.parse(dataStr);

      if (data.trades) {
        for (const trade of data.trades) {
          await db.put('trades', trade);
        }
        setTrades(data.trades);
      }

      if (data.reflections) {
        for (const reflection of data.reflections) {
          await db.put('reflections', reflection);
        }
        setReflections(data.reflections);
      }

      if (data.rules) {
        for (const rule of data.rules) {
          await db.put('rules', rule);
        }
        setRules(data.rules);
      }

      if (data.settings) {
        await db.put('settings', { key: 'appSettings', value: data.settings });
        setSettings(data.settings);
      }

      const lastSaved = localStorage.getItem('lastSaved');
      toast.success(`Data loaded from ${lastSaved ? new Date(lastSaved).toLocaleString() : 'local storage'}`);
      return true;
    } catch (error) {
      console.error('Failed to load from local:', error);
      toast.error('Failed to load local data');
      return false;
    }
  };

  // Auto-save to localStorage every 5 minutes
  useEffect(() => {
    if (!db) return;

    const autoSave = setInterval(() => {
      if (trades.length > 0 || reflections.length > 0 || rules.length > 0) {
        const data = {
          trades,
          reflections,
          rules,
          settings,
          autoSaveDate: new Date().toISOString(),
        };
        localStorage.setItem('tradingJournalAutoSave', JSON.stringify(data));
        console.log('Auto-saved at', new Date().toLocaleString());
      }
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(autoSave);
  }, [trades, reflections, rules, settings, db]);

  // Import data
  const importData = async (file) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (data.trades) {
        for (const trade of data.trades) {
          await db.put('trades', trade);
        }
        setTrades(data.trades);
      }

      if (data.reflections) {
        for (const reflection of data.reflections) {
          await db.put('reflections', reflection);
        }
        setReflections(data.reflections);
      }

      if (data.rules) {
        for (const rule of data.rules) {
          await db.put('rules', rule);
        }
        setRules(data.rules);
      }

      if (data.settings) {
        await db.put('settings', { key: 'appSettings', value: data.settings });
        setSettings(data.settings);
      }

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
    saveToLocal,
    loadFromLocal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
