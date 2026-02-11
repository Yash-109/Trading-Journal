import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useTrades } from '../hooks/useTrades';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Download, TrendingUp, TrendingDown } from 'lucide-react';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import { computeDecisionQualityAnalytics } from '../utils/decisionQualityAnalytics';
import { formatPnLWithSign, formatPnLWithCurrency, getCurrencySymbol } from '../utils/currencyFormatter';
import { convertTradesArray } from '../utils/currencyConverter';

const Analytics = () => {
  const { trades: rawTrades = [], settings } = useApp();
  
  // Get account currency from settings
  const accountCurrency = settings.defaultCurrency || 'USD';
  
  // Get normalized trades using centralized hook
  const normalizedTrades = useTrades(rawTrades);
  
  // Convert all trades to account currency for analytics
  const convertedTrades = useMemo(() => {
    return convertTradesArray(normalizedTrades, accountCurrency);
  }, [normalizedTrades, accountCurrency]);

  // Analytics calculations from converted trades
  const analytics = useMemo(() => {
    if (!convertedTrades || convertedTrades.length === 0) return null;

    // Helper function to calculate stats for a subset of trades
    const calculateStats = (trades) => {
      if (!trades || trades.length === 0) {
        return {
          totalTrades: 0,
          winningTrades: 0,
          losingTrades: 0,
          winRate: 0,
          totalPnl: 0,
          avgPnl: 0,
        };
      }

      const winningTrades = trades.filter(t => t.convertedPnl > 0).length;
      const losingTrades = trades.filter(t => t.convertedPnl < 0).length;
      const totalPnl = trades.reduce((sum, t) => sum + (t.convertedPnl || 0), 0);

      return {
        totalTrades: trades.length,
        winningTrades,
        losingTrades,
        winRate: trades.length > 0 ? (winningTrades / trades.length) * 100 : 0,
        totalPnl,
        avgPnl: trades.length > 0 ? totalPnl / trades.length : 0,
      };
    };

    // Separate trades by market
    const forexTrades = convertedTrades.filter(t => t.market === 'FOREX');
    const cryptoTrades = convertedTrades.filter(t => t.market === 'CRYPTO');
    const indianTrades = convertedTrades.filter(t => t.market === 'INDIAN');

    // Further separate INDIAN trades by instrument type
    const indianIndexTrades = indianTrades.filter(t => t.instrumentType === 'INDEX' || !t.instrumentType);
    const indianFNOTrades = indianTrades.filter(t => t.instrumentType === 'FNO');

    // Calculate stats for each market
    const marketStats = {
      FOREX: calculateStats(forexTrades),
      CRYPTO: calculateStats(cryptoTrades),
      INDIAN: calculateStats(indianTrades),
      INDIAN_INDEX: calculateStats(indianIndexTrades),
      INDIAN_FNO: calculateStats(indianFNOTrades),
      OVERALL: calculateStats(convertedTrades),
    };

    // By Pair/Symbol (market-aware: use displayPair from normalized trades)
    const byPair = {};
    normalizedTrades.forEach(trade => {
      const key = trade.displayPair || 'Unknown';
      if (!byPair[key]) {
        byPair[key] = { wins: 0, losses: 0, total: 0, pl: 0 };
      }
      byPair[key].total++;
      byPair[key].pl += trade.convertedPnl;
      if (trade.convertedPnl > 0) byPair[key].wins++;
      else byPair[key].losses++;
    });

    const pairData = Object.entries(byPair).map(([pair, data]) => ({
      pair,
      winRate: (data.wins / data.total) * 100,
      trades: data.total,
      pl: data.pl,
    })).sort((a, b) => b.pl - a.pl);

    // By Emotion
    const byEmotion = {};
    convertedTrades.forEach(trade => {
      const emotion = trade.emotion || 'Unknown';
      if (!byEmotion[emotion]) {
        byEmotion[emotion] = { count: 0, wins: 0, pl: 0 };
      }
      byEmotion[emotion].count++;
      byEmotion[emotion].pl += trade.convertedPnl;
      if (trade.convertedPnl > 0) byEmotion[emotion].wins++;
    });

    const emotionData = Object.entries(byEmotion).map(([emotion, data]) => ({
      emotion,
      count: data.count,
      winRate: (data.wins / data.count) * 100,
      pl: data.pl,
    }));

    // By Session
    const bySession = {};
    convertedTrades.forEach(trade => {
      const session = trade.session || 'Unknown';
      if (!bySession[session]) {
        bySession[session] = { count: 0, wins: 0, pl: 0 };
      }
      bySession[session].count++;
      bySession[session].pl += trade.convertedPnl;
      if (trade.convertedPnl > 0) bySession[session].wins++;
    });

    const sessionData = Object.entries(bySession).map(([session, data]) => ({
      session,
      count: data.count,
      winRate: (data.wins / data.count) * 100,
      pl: data.pl,
    }));

    // By Strategy
    const byStrategy = {};
    normalizedTrades.forEach(trade => {
      const strategy = trade.strategy || 'None';
      if (!byStrategy[strategy]) {
        byStrategy[strategy] = { count: 0, wins: 0, pl: 0 };
      }
      byStrategy[strategy].count++;
      byStrategy[strategy].pl += trade.convertedPnl;
      if (trade.convertedPnl > 0) byStrategy[strategy].wins++;
    });

    const strategyData = Object.entries(byStrategy).map(([strategy, data]) => ({
      strategy,
      count: data.count,
      winRate: (data.wins / data.count) * 100,
      pl: data.pl,
    }));

    // Rule Compliance
    const rulesFollowed = convertedTrades.filter(t => t.ruleFollowed).length;
    const rulesBroken = convertedTrades.length - rulesFollowed;
    const rulesData = [
      { name: 'Followed', value: rulesFollowed, color: '#10b981' },
      { name: 'Broken', value: rulesBroken, color: '#ef4444' },
    ];

    // Win/Loss Distribution
    const wins = convertedTrades.filter(t => t.convertedPnl > 0).length;
    const losses = convertedTrades.filter(t => t.convertedPnl < 0).length;
    const breakeven = convertedTrades.filter(t => t.convertedPnl === 0).length;
    const winLossData = [
      { name: 'Wins', value: wins, color: '#10b981' },
      { name: 'Losses', value: losses, color: '#ef4444' },
      { name: 'Breakeven', value: breakeven, color: '#6b7280' },
    ];

    // Market Distribution Data
    const marketData = [
      { name: 'FOREX', value: marketStats.FOREX.totalTrades, color: '#3b82f6' },
      { name: 'CRYPTO', value: marketStats.CRYPTO.totalTrades, color: '#f59e0b' },
      { name: 'INDIAN', value: marketStats.INDIAN.totalTrades, color: '#8b5cf6' },
    ].filter(m => m.value > 0);

    // ============================================================================
    // INDIAN F&O ANALYTICS
    // ============================================================================

    // B. Option Type Performance
    const byOptionType = {};
    indianFNOTrades.forEach(trade => {
      const optionType = trade.optionType || 'Unknown';
      if (!byOptionType[optionType]) {
        byOptionType[optionType] = { count: 0, wins: 0, pl: 0 };
      }
      byOptionType[optionType].count++;
      byOptionType[optionType].pl += trade.convertedPnl || 0;
      if (trade.convertedPnl > 0) byOptionType[optionType].wins++;
    });

    const optionTypeData = Object.entries(byOptionType).map(([optionType, data]) => ({
      optionType,
      count: data.count,
      winRate: data.count > 0 ? (data.wins / data.count) * 100 : 0,
      pl: data.pl,
    }));

    // C. Strike Price Performance
    const byStrikePrice = {};
    indianFNOTrades.forEach(trade => {
      const strikePrice = trade.strikePrice || 0;
      const key = strikePrice.toString();
      if (!byStrikePrice[key]) {
        byStrikePrice[key] = { count: 0, pl: 0 };
      }
      byStrikePrice[key].count++;
      byStrikePrice[key].pl += trade.convertedPnl || 0;
    });

    const strikePriceData = Object.entries(byStrikePrice)
      .map(([strikePrice, data]) => ({
        strikePrice: parseFloat(strikePrice),
        count: data.count,
        pl: data.pl,
      }))
      .sort((a, b) => a.strikePrice - b.strikePrice);

    // D. Expiry Date Performance
    const byExpiryDate = {};
    indianFNOTrades.forEach(trade => {
      const expiryDate = trade.expiryDate || 'Unknown';
      if (!byExpiryDate[expiryDate]) {
        byExpiryDate[expiryDate] = { count: 0, wins: 0, pl: 0 };
      }
      byExpiryDate[expiryDate].count++;
      byExpiryDate[expiryDate].pl += trade.convertedPnl || 0;
      if (trade.convertedPnl > 0) byExpiryDate[expiryDate].wins++;
    });

    const expiryDateData = Object.entries(byExpiryDate)
      .map(([expiryDate, data]) => ({
        expiryDate,
        count: data.count,
        winRate: data.count > 0 ? (data.wins / data.count) * 100 : 0,
        pl: data.pl,
      }))
      .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

    // ============================================================================

    // ============================================================================
    // DECISION QUALITY ANALYTICS (Phase 6C)
    // ============================================================================
    const decisionQualityAnalytics = computeDecisionQualityAnalytics(normalizedTrades);

    return {
      marketStats,
      marketData,
      pairData,
      emotionData,
      sessionData,
      strategyData,
      rulesData,
      winLossData,
      // F&O Analytics
      optionTypeData,
      strikePriceData,
      expiryDateData,
      hasFNOTrades: indianFNOTrades.length > 0,
      // Decision Quality Analytics
      decisionQuality: decisionQualityAnalytics,
    };
  }, [normalizedTrades]);

  const exportPDF = () => {
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.width;
      
      // Title
      pdf.setFontSize(20);
      pdf.text('Trading Journal Analytics Report', pageWidth / 2, 20, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
      
      let y = 45;

      // Summary
      pdf.setFontSize(14);
      pdf.text('Summary', 20, y);
      y += 10;
      
      pdf.setFontSize(10);
      const totalPL = convertedTrades.reduce((sum, t) => sum + t.convertedPnl, 0);
      const wins = convertedTrades.filter(t => t.convertedPnl > 0).length;
      const winRate = convertedTrades.length > 0 ? (wins / convertedTrades.length) * 100 : 0;
      
      pdf.text(`Total Trades: ${convertedTrades.length}`, 20, y);
      y += 7;
      pdf.text(`Win Rate: ${Number(winRate || 0).toFixed(1)}%`, 20, y);
      y += 7;
      pdf.text(`Total P/L: ${formatPnLWithSign(totalPL || 0, predominantMarket)}`, 20, y);
      y += 15;

      // Best Performing Pair
      if (analytics?.pairData.length > 0) {
        pdf.setFontSize(14);
        pdf.text('Top Performing Pairs', 20, y);
        y += 10;
        
        pdf.setFontSize(10);
        analytics.pairData.slice(0, 5).forEach(pair => {
          pdf.text(`${pair.pair}: ${formatPnLWithSign(pair.pl || 0, predominantMarket)} (${Number(pair.winRate || 0).toFixed(1)}% WR, ${pair.trades} trades)`, 20, y);
          y += 7;
        });
      }

      pdf.save('trading-analytics-report.pdf');
      toast.success('PDF report downloaded!');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF');
    }
  };

  if (!analytics || convertedTrades.length === 0) {
    return (
      <div className="space-y-6 animate-slide-in">
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <div className="bg-dark-card border border-dark-border rounded-xl p-12 text-center">
          <BarChart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Data Available</h3>
          <p className="text-gray-400">Start logging trades to see your analytics</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];
  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-gray-400">
            Deep dive into your trading performance. 
            <span className="ml-2 text-gold-500 font-medium">
              All metrics in {accountCurrency}
            </span>
          </p>
        </div>
        <button onClick={exportPDF} className="btn-primary flex items-center space-x-2">
          <Download className="w-5 h-5" />
          <span>Export PDF</span>
        </button>
      </div>

      {/* Win/Loss and Rules Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-card border border-dark-border rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Win/Loss Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={analytics.winLossData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.winLossData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const { name, value } = payload[0].payload;
                  const total = analytics.winLossData.reduce((sum, d) => sum + d.value, 0);
                  const percent = total > 0 ? (value / total) * 100 : 0;
                  return (
                    <div
                      style={{
                        backgroundColor: '#f9fafb',
                        color: '#111827',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      }}
                    >
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{name}</div>
                      <div style={{ fontSize: 12 }}>Trades: {value}</div>
                      <div style={{ fontSize: 12 }}>Share: {percent.toFixed(1)}%</div>
                    </div>
                  );
                }}
              />
              <Legend
                wrapperStyle={{ color: '#e5e7eb' }}
                formatter={(value) => {
                  const total = analytics.winLossData.reduce((sum, d) => sum + d.value, 0);
                  const item = analytics.winLossData.find((d) => d.name === value);
                  const percent = total > 0 && item ? (item.value / total) * 100 : 0;
                  return `${value} (${percent.toFixed(0)}%)`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-card border border-dark-border rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Rule Compliance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={analytics.rulesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.rulesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const { name, value } = payload[0].payload;
                  const total = analytics.rulesData.reduce((sum, d) => sum + d.value, 0);
                  const percent = total > 0 ? (value / total) * 100 : 0;
                  return (
                    <div
                      style={{
                        backgroundColor: '#f9fafb',
                        color: '#111827',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      }}
                    >
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{name}</div>
                      <div style={{ fontSize: 12 }}>Trades: {value}</div>
                      <div style={{ fontSize: 12 }}>Share: {percent.toFixed(1)}%</div>
                    </div>
                  );
                }}
              />
              <Legend
                wrapperStyle={{ color: '#e5e7eb' }}
                formatter={(value) => {
                  const total = analytics.rulesData.reduce((sum, d) => sum + d.value, 0);
                  const item = analytics.rulesData.find((d) => d.name === value);
                  const percent = total > 0 && item ? (item.value / total) * 100 : 0;
                  return `${value} (${percent.toFixed(0)}%)`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ============================================================================ */}
      {/* DECISION QUALITY ANALYTICS (Phase 6C) */}
      {/* ============================================================================ */}
      
      {/* Discipline Score Card */}
      {analytics.decisionQuality && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-gradient-to-br from-dark-card to-dark-bg border border-dark-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Overall Discipline Score</h3>
              <span className={`px-4 py-2 rounded-lg font-bold text-lg ${
                analytics.decisionQuality.disciplineLabel === 'Good' ? 'bg-profit/20 text-profit' :
                analytics.decisionQuality.disciplineLabel === 'Average' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-loss/20 text-loss'
              }`}>
                {analytics.decisionQuality.disciplineLabel}
              </span>
            </div>
            
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="#2d3748"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke={
                      analytics.decisionQuality.disciplineLabel === 'Good' ? '#10b981' :
                      analytics.decisionQuality.disciplineLabel === 'Average' ? '#f59e0b' :
                      '#ef4444'
                    }
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - analytics.decisionQuality.disciplineScore / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-white">
                    {analytics.decisionQuality.disciplineScore}
                  </span>
                  <span className="text-gray-400 text-sm">out of 100</span>
                </div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-400 uppercase mb-4">Score Breakdown</h4>
              
              {Object.entries(analytics.decisionQuality.disciplineBreakdown).map(([key, data]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300 capitalize">
                      {key === 'ruleFollow' ? 'Rule Compliance' :
                       key === 'tradeQuality' ? 'Trade Quality' :
                       key === 'emotionStability' ? 'Emotion Stability' :
                       key === 'winRate' ? 'Win Rate' : key}
                    </span>
                    <span className="text-white font-semibold">
                      {data.value.toFixed(1)}% × {(data.weight * 100).toFixed(0)}% = {data.weighted.toFixed(1)}
                    </span>
                  </div>
                  <div className="w-full bg-dark-border rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${data.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-dark-bg rounded-lg border border-dark-border">
              <p className="text-xs text-gray-400 leading-relaxed">
                <strong className="text-gray-300">How it's calculated:</strong> This score combines multiple factors with configurable weights. 
                Rule compliance ({(analytics.decisionQuality.config.weights.ruleFollow * 100).toFixed(0)}%), 
                trade quality ({(analytics.decisionQuality.config.weights.tradeQuality * 100).toFixed(0)}%), 
                emotion stability ({(analytics.decisionQuality.config.weights.emotionStability * 100).toFixed(0)}%), 
                and win rate ({(analytics.decisionQuality.config.weights.winRate * 100).toFixed(0)}%). 
                Weights can be adjusted in the config file.
              </p>
            </div>
          </motion.div>

          {/* Rule Followed vs Broken Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-dark-card border border-dark-border rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Rule-Followed vs Rule-Broken Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rules Followed */}
              <div className="bg-dark-bg rounded-lg p-4 border border-profit/30">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-profit"></div>
                  <h4 className="text-lg font-semibold text-white">Rules Followed</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Trades:</span>
                    <span className="text-white font-semibold">{analytics.decisionQuality.ruleComparison.ruleFollowed.trades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Win Rate:</span>
                    <span className="text-profit font-semibold">
                      {analytics.decisionQuality.ruleComparison.ruleFollowed.winRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg P/L:</span>
                    <span className={`font-semibold ${analytics.decisionQuality.ruleComparison.ruleFollowed.avgPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                      {formatPnLWithSign(analytics.decisionQuality.ruleComparison.ruleFollowed.avgPnl, predominantMarket)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total P/L:</span>
                    <span className={`font-bold text-lg ${analytics.decisionQuality.ruleComparison.ruleFollowed.totalPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                      {formatPnLWithSign(analytics.decisionQuality.ruleComparison.ruleFollowed.totalPnl, predominantMarket)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rules Broken */}
              <div className="bg-dark-bg rounded-lg p-4 border border-loss/30">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-loss"></div>
                  <h4 className="text-lg font-semibold text-white">Rules Broken</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Trades:</span>
                    <span className="text-white font-semibold">{analytics.decisionQuality.ruleComparison.ruleBroken.trades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Win Rate:</span>
                    <span className="text-loss font-semibold">
                      {analytics.decisionQuality.ruleComparison.ruleBroken.winRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg P/L:</span>
                    <span className={`font-semibold ${analytics.decisionQuality.ruleComparison.ruleBroken.avgPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                      {formatPnLWithSign(analytics.decisionQuality.ruleComparison.ruleBroken.avgPnl, predominantMarket)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total P/L:</span>
                    <span className={`font-bold text-lg ${analytics.decisionQuality.ruleComparison.ruleBroken.totalPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                      {formatPnLWithSign(analytics.decisionQuality.ruleComparison.ruleBroken.totalPnl, predominantMarket)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trade Quality Buckets Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-dark-card border border-dark-border rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Performance by Trade Quality Rating</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Poor Quality (1-3) */}
              <div className="bg-dark-bg rounded-lg p-4 border border-loss/30">
                <h4 className="text-lg font-semibold text-loss mb-3">Poor (1-3)</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Trades:</span>
                    <span className="text-white">{analytics.decisionQuality.qualityBuckets.poor.trades}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Win Rate:</span>
                    <span className="text-white">{analytics.decisionQuality.qualityBuckets.poor.winRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Avg P/L:</span>
                    <span className={analytics.decisionQuality.qualityBuckets.poor.avgPnl >= 0 ? 'text-profit' : 'text-loss'}>
                      {formatPnLWithSign(analytics.decisionQuality.qualityBuckets.poor.avgPnl, predominantMarket)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Average Quality (4-6) */}
              <div className="bg-dark-bg rounded-lg p-4 border border-yellow-500/30">
                <h4 className="text-lg font-semibold text-yellow-400 mb-3">Average (4-6)</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Trades:</span>
                    <span className="text-white">{analytics.decisionQuality.qualityBuckets.average.trades}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Win Rate:</span>
                    <span className="text-white">{analytics.decisionQuality.qualityBuckets.average.winRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Avg P/L:</span>
                    <span className={analytics.decisionQuality.qualityBuckets.average.avgPnl >= 0 ? 'text-profit' : 'text-loss'}>
                      {formatPnLWithSign(analytics.decisionQuality.qualityBuckets.average.avgPnl, predominantMarket)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Good Quality (7-10) */}
              <div className="bg-dark-bg rounded-lg p-4 border border-profit/30">
                <h4 className="text-lg font-semibold text-profit mb-3">Good (7-10)</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Trades:</span>
                    <span className="text-white">{analytics.decisionQuality.qualityBuckets.good.trades}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Win Rate:</span>
                    <span className="text-white">{analytics.decisionQuality.qualityBuckets.good.winRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Avg P/L:</span>
                    <span className={analytics.decisionQuality.qualityBuckets.good.avgPnl >= 0 ? 'text-profit' : 'text-loss'}>
                      {formatPnLWithSign(analytics.decisionQuality.qualityBuckets.good.avgPnl, predominantMarket)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Emotion-wise Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-dark-card border border-dark-border rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Performance by Emotional State</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Emotion</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Trades</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Win Rate</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Avg P/L</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Total P/L</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.decisionQuality.emotionPerformance.map((emotion, index) => (
                    <tr key={index} className="border-b border-dark-border/50">
                      <td className="py-3 px-4 text-white font-semibold">{emotion.emotion}</td>
                      <td className="py-3 px-4 text-gray-300">{emotion.trades}</td>
                      <td className="py-3 px-4">
                        <span className={emotion.winRate >= 50 ? 'text-profit' : 'text-loss'}>
                          {emotion.winRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${emotion.avgPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                          {formatPnLWithSign(emotion.avgPnl, predominantMarket)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-bold ${emotion.totalPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                          {formatPnLWithSign(emotion.totalPnl, predominantMarket)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}

      {/* ============================================================================ */}
      {/* END OF DECISION QUALITY ANALYTICS */}
      {/* ============================================================================ */}

      {/* Performance by Pair */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-dark-card border border-dark-border rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Performance by Pair</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[...analytics.pairData].sort((a, b) => Math.abs(b.pl) - Math.abs(a.pl))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
            <XAxis dataKey="pair" stroke="#9ca3af" />
            <YAxis
              stroke="#9ca3af"
              tickFormatter={(value) => `${currencySymbol}${value}`}
            />
            <ReferenceLine y={0} stroke="#6b7280" strokeWidth={1} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                const value = payload[0].value;
                return (
                  <div
                    style={{
                      backgroundColor: '#f9fafb',
                      color: '#111827',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 12 }}>Net P/L: {formatPnLWithSign(value, predominantMarket)}</div>
                  </div>
                );
              }}
            />
            <Legend />
            <Bar dataKey="pl" name="Net P/L">
              {[...analytics.pairData].sort((a, b) => Math.abs(b.pl) - Math.abs(a.pl)).map((entry, index) => (
                <Cell
                  key={`pair-bar-${index}`}
                  fill={entry.pl >= 0 ? '#10b981' : '#ef4444'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Win Rate by Pair */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-dark-card border border-dark-border rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Win Rate by Pair</h3>
        <div className="space-y-4">
          {Array.isArray(analytics.pairData) && analytics.pairData.map((pair, index) => (
            <div key={pair.pair} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">{pair.pair}</span>
                <span className="text-gray-400 text-sm">
                  {Number(pair.winRate || 0).toFixed(1)}% ({pair.trades} trades)
                </span>
              </div>
              <div className="w-full bg-dark-bg rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.max(0, Number(pair.winRate || 0)))}%` }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  className={`h-full rounded-full ${
                    (pair.winRate || 0) >= 60 ? 'bg-profit' : (pair.winRate || 0) >= 40 ? 'bg-gold-500' : 'bg-loss'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Performance by Session */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-dark-card border border-dark-border rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Performance by Session</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.sessionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
            <XAxis dataKey="session" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#151922',
                border: '1px solid #2d3748',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="pl" name="Profit/Loss" fill="#10b981" />
            <Bar dataKey="winRate" name="Win Rate %" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Emotion Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-dark-card border border-dark-border rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Emotion Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(analytics.emotionData) && analytics.emotionData.map((emotion, index) => (
            <div
              key={emotion.emotion}
              className="bg-dark-bg border border-dark-border rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-white">{emotion.emotion}</h4>
                <span className="text-sm text-gray-400">{emotion.count} trades</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Win Rate</span>
                  <span className={(emotion.winRate || 0) >= 50 ? 'text-profit' : 'text-loss'}>
                    {Number(emotion.winRate || 0).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">P/L</span>
                  <span className={(emotion.pl || 0) >= 0 ? 'text-profit' : 'text-loss'}>
                    {formatPnLWithSign(emotion.pl || 0, predominantMarket)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Strategy Performance */}
      {analytics.strategyData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-dark-card border border-dark-border rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Strategy Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Strategy</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Trades</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Win Rate</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">P/L</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(analytics.strategyData) && analytics.strategyData
                  .sort((a, b) => (b.pl || 0) - (a.pl || 0))
                  .map((strategy, index) => (
                    <tr key={index} className="border-b border-dark-border/50">
                      <td className="py-3 px-4 text-white font-semibold">{strategy.strategy}</td>
                      <td className="py-3 px-4 text-gray-300">{strategy.count}</td>
                      <td className="py-3 px-4">
                        <span className={(strategy.winRate || 0) >= 50 ? 'text-profit' : 'text-loss'}>
                          {Number(strategy.winRate || 0).toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${(strategy.pl || 0) >= 0 ? 'text-profit' : 'text-loss'}`}>
                          {formatPnLWithSign(strategy.pl || 0, predominantMarket)}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* ============================================================================ */}
      {/* INDIAN F&O ANALYTICS SECTION */}
      {/* ============================================================================ */}

      {/* F&O Option Type Performance */}
      {analytics.hasFNOTrades && analytics.optionTypeData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-dark-card border border-dark-border rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">F&O Option Type Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.optionTypeData.map((option, index) => (
              <div
                key={option.optionType}
                className="bg-dark-bg border border-dark-border rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white">{option.optionType}</h4>
                  <span className="text-sm text-gray-400">{option.count} trades</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Win Rate</span>
                    <span className={(option.winRate || 0) >= 50 ? 'text-profit' : 'text-loss'}>
                      {Number(option.winRate || 0).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">P/L</span>
                    <span className={(option.pl || 0) >= 0 ? 'text-profit' : 'text-loss'}>
                      {(option.pl || 0) >= 0 ? '+' : ''}{Number(option.pl || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* F&O Strike Price Performance */}
      {analytics.hasFNOTrades && analytics.strikePriceData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-dark-card border border-dark-border rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">F&O Strike Price Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Strike Price</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Trades</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">P/L</th>
                </tr>
              </thead>
              <tbody>
                {analytics.strikePriceData
                  .sort((a, b) => (b.pl || 0) - (a.pl || 0))
                  .map((strike, index) => (
                    <tr key={index} className="border-b border-dark-border/50">
                      <td className="py-3 px-4 text-white font-semibold">
                        {Number(strike.strikePrice).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-gray-300">{strike.count}</td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${(strike.pl || 0) >= 0 ? 'text-profit' : 'text-loss'}`}>
                          {(strike.pl || 0) >= 0 ? '+' : ''}{Number(strike.pl || 0).toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* F&O Expiry Date Performance */}
      {analytics.hasFNOTrades && analytics.expiryDateData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-dark-card border border-dark-border rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">F&O Expiry Date Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Expiry Date</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Trades</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Win Rate</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">P/L</th>
                </tr>
              </thead>
              <tbody>
                {analytics.expiryDateData.map((expiry, index) => (
                  <tr key={index} className="border-b border-dark-border/50">
                    <td className="py-3 px-4 text-white font-semibold">
                      {new Date(expiry.expiryDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-3 px-4 text-gray-300">{expiry.count}</td>
                    <td className="py-3 px-4">
                      <span className={(expiry.winRate || 0) >= 50 ? 'text-profit' : 'text-loss'}>
                        {Number(expiry.winRate || 0).toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${(expiry.pl || 0) >= 0 ? 'text-profit' : 'text-loss'}`}>
                        {(expiry.pl || 0) >= 0 ? '+' : ''}{Number(expiry.pl || 0).toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Analytics;
