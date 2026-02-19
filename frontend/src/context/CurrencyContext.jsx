import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApp } from './AppContext';

/**
 * ============================================================================
 * CURRENCY CONTEXT - SINGLE SOURCE OF TRUTH FOR CURRENCY CONVERSION
 * ============================================================================
 * 
 * This context provides:
 * 1. Live USD→INR exchange rate from backend API
 * 2. Centralized conversion functions
 * 3. Currency formatting utilities
 * 4. Consistent re-rendering when currency changes
 * 
 * ARCHITECTURE RULES:
 * - All trades stored in USD only (backend enforces this)
 * - Each trade has exchangeRateAtExecution (historical rate when trade was made)
 * - Frontend uses historical rates for accuracy
 * - Live rate used ONLY for display context and new trades
 * - Conversion happens ONLY at render level
 * - No double conversion - single pass through convertAmount()
 * ============================================================================
 */

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const { settings } = useApp();
  
  // Get selected currency from settings
  const selectedCurrency = settings?.defaultCurrency || 'USD';
  
  // Store live exchange rate (fetched from backend)
  const [exchangeRate, setExchangeRate] = useState(null);
  const [isLoadingRate, setIsLoadingRate] = useState(true);
  const [rateError, setRateError] = useState(null);
  
  /**
   * Fetch live USD→INR exchange rate from backend
   */
  const fetchExchangeRate = async () => {
    try {
      setIsLoadingRate(true);
      setRateError(null);
      
      const response = await fetch('/api/exchange-rate/current', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rate');
      }
      
      const data = await response.json();
      
      // API returns { status: 'success', data: { USD_INR: 83.25 } }
      const rate = data?.data?.USD_INR || data?.USD_INR || 83.0;
      
      setExchangeRate(rate);
      console.log('✅ Exchange rate loaded:', rate);
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
      setRateError(error.message);
      // Fallback rate if API fails
      setExchangeRate(83.0);
    } finally {
      setIsLoadingRate(false);
    }
  };
  
  // Fetch rate on mount and when currency changes
  useEffect(() => {
    // Only fetch if we need INR conversion
    if (selectedCurrency === 'INR' || selectedCurrency === 'USD') {
      fetchExchangeRate();
    } else {
      // For other currencies, set a default rate
      setExchangeRate(1);
      setIsLoadingRate(false);
    }
  }, [selectedCurrency]);
  
  /**
   * ============================================================================
   * CORE CONVERSION FUNCTION - SINGLE SOURCE OF TRUTH
   * ============================================================================
   * 
   * Convert amount from USD to selected currency
   * 
   * IMPORTANT: This uses LIVE exchange rate for display
   * Historical trades use their stored exchangeRateAtExecution
   * 
   * @param {number} amountUSD - Amount in USD
   * @param {number} customRate - Optional: Use custom rate (for historical trades)
   * @returns {number} Converted amount
   */
  const convertAmount = (amountUSD, customRate = null) => {
    // Guard: Handle invalid inputs
    if (!amountUSD || typeof amountUSD !== 'number' || isNaN(amountUSD) || !isFinite(amountUSD)) {
      return 0;
    }
    
    // If no conversion needed (USD to USD)
    if (selectedCurrency === 'USD') {
      return amountUSD;
    }
    
    // Use custom rate if provided (for historical trades)
    const rateToUse = customRate !== null ? customRate : exchangeRate;
    
    // Guard: Ensure valid rate
    if (!rateToUse || rateToUse <= 0 || isNaN(rateToUse) || !isFinite(rateToUse)) {
      console.warn('Invalid exchange rate, returning original amount');
      return amountUSD;
    }
    
    // Convert USD to INR
    if (selectedCurrency === 'INR') {
      const result = amountUSD * rateToUse;
      return isFinite(result) ? result : amountUSD;
    }
    
    // For other currencies (EUR, GBP, etc.), return as-is for now
    // TODO: Implement multi-currency support
    return amountUSD;
  };
  
  /**
   * ============================================================================
   * CURRENCY FORMATTING - CONSISTENT DISPLAY
   * ============================================================================
   * 
   * Format amount with proper currency symbol and locale
   * 
   * @param {number} amount - Amount to format (already converted)
   * @param {boolean} showSign - Whether to show + for positive values
   * @returns {string} Formatted currency string
   */
  const formatCurrency = (amount, showSign = false) => {
    const num = parseFloat(amount) || 0;
    
    // Determine locale
    const locale = selectedCurrency === 'INR' ? 'en-IN' : 'en-US';
    
    try {
      // Use Intl.NumberFormat for proper formatting
      const formatted = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: selectedCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Math.abs(num));
      
      // Add sign if needed
      if (num > 0 && showSign) {
        return `+${formatted}`;
      } else if (num < 0) {
        return `-${formatted}`;
      }
      
      return formatted;
    } catch (error) {
      console.error('Currency formatting error:', error);
      // Fallback to simple formatting
      const symbol = getCurrencySymbol(selectedCurrency);
      return `${num < 0 ? '-' : showSign && num > 0 ? '+' : ''}${symbol}${Math.abs(num).toFixed(2)}`;
    }
  };
  
  /**
   * Get currency symbol
   */
  const getCurrencySymbol = (currencyCode = selectedCurrency) => {
    const symbols = {
      USD: '$',
      INR: '₹',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
    };
    return symbols[currencyCode] || '$';
  };
  
  /**
   * Convert trade P&L using historical rate
   * 
   * @param {Object} trade - Trade object with pnl and exchangeRateAtExecution
   * @returns {number} Converted P&L
   */
  const convertTradePnL = (trade) => {
    if (!trade) return 0;
    
    const pnl = Number(trade.pnl) || 0;
    const tradeCurrency = trade.tradeCurrency || 'USD';
    const historicalRate = Number(trade.exchangeRateAtExecution);
    
    // If trade currency matches selected currency, no conversion needed
    if (tradeCurrency === selectedCurrency) {
      return pnl;
    }
    
    // Use historical rate from trade for accuracy
    if (tradeCurrency === 'USD' && selectedCurrency === 'INR') {
      if (historicalRate && historicalRate > 0) {
        return pnl * historicalRate;
      }
    } else if (tradeCurrency === 'INR' && selectedCurrency === 'USD') {
      if (historicalRate && historicalRate > 0) {
        return pnl / historicalRate;
      }
    }
    
    // Fallback: use live rate
    return convertAmount(pnl);
  };
  
  const value = {
    // State
    selectedCurrency,
    exchangeRate,
    isLoadingRate,
    rateError,
    
    // Core functions
    convertAmount,
    formatCurrency,
    getCurrencySymbol,
    convertTradePnL,
    
    // Utilities
    refreshRate: fetchExchangeRate,
  };
  
  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

