import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
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

const Analytics = () => {
  const { trades = [], settings } = useApp();

  // Analytics calculations
  const analytics = useMemo(() => {
    if (!trades || trades.length === 0) return null;

    // By Pair
    const byPair = {};
    trades.forEach(trade => {
      const pair = trade.pair || 'Unknown';
      if (!byPair[pair]) {
        byPair[pair] = { wins: 0, losses: 0, total: 0, pl: 0 };
      }
      byPair[pair].total++;
      byPair[pair].pl += Number(trade.profitLoss || 0);
      if (Number(trade.profitLoss || 0) > 0) byPair[pair].wins++;
      else byPair[pair].losses++;
    });

    const pairData = Object.entries(byPair).map(([pair, data]) => ({
      pair,
      winRate: (data.wins / data.total) * 100,
      trades: data.total,
      pl: data.pl,
    })).sort((a, b) => b.pl - a.pl);

    // By Emotion
    const byEmotion = {};
    trades.forEach(trade => {
      const emotion = trade.emotion || 'Unknown';
      if (!byEmotion[emotion]) {
        byEmotion[emotion] = { count: 0, wins: 0, pl: 0 };
      }
      byEmotion[emotion].count++;
      byEmotion[emotion].pl += Number(trade.profitLoss || 0);
      if (Number(trade.profitLoss || 0) > 0) byEmotion[emotion].wins++;
    });

    const emotionData = Object.entries(byEmotion).map(([emotion, data]) => ({
      emotion,
      count: data.count,
      winRate: (data.wins / data.count) * 100,
      pl: data.pl,
    }));

    // By Session
    const bySession = {};
    trades.forEach(trade => {
      const session = trade.session || 'Unknown';
      if (!bySession[session]) {
        bySession[session] = { count: 0, wins: 0, pl: 0 };
      }
      bySession[session].count++;
      bySession[session].pl += Number(trade.profitLoss || 0);
      if (Number(trade.profitLoss || 0) > 0) bySession[session].wins++;
    });

    const sessionData = Object.entries(bySession).map(([session, data]) => ({
      session,
      count: data.count,
      winRate: (data.wins / data.count) * 100,
      pl: data.pl,
    }));

    // By Strategy
    const byStrategy = {};
    trades.forEach(trade => {
      const strategy = trade.strategy || 'None';
      if (!byStrategy[strategy]) {
        byStrategy[strategy] = { count: 0, wins: 0, pl: 0 };
      }
      byStrategy[strategy].count++;
      byStrategy[strategy].pl += Number(trade.profitLoss || 0);
      if (Number(trade.profitLoss || 0) > 0) byStrategy[strategy].wins++;
    });

    const strategyData = Object.entries(byStrategy).map(([strategy, data]) => ({
      strategy,
      count: data.count,
      winRate: (data.wins / data.count) * 100,
      pl: data.pl,
    }));

    // Rule Compliance
    const rulesFollowed = trades.filter(t => t.ruleFollowed).length;
    const rulesBroken = trades.length - rulesFollowed;
    const rulesData = [
      { name: 'Followed', value: rulesFollowed, color: '#10b981' },
      { name: 'Broken', value: rulesBroken, color: '#ef4444' },
    ];

    // Win/Loss Distribution
    const wins = trades.filter(t => Number(t.profitLoss || 0) > 0).length;
    const losses = trades.filter(t => Number(t.profitLoss || 0) < 0).length;
    const breakeven = trades.filter(t => Number(t.profitLoss || 0) === 0).length;
    const winLossData = [
      { name: 'Wins', value: wins, color: '#10b981' },
      { name: 'Losses', value: losses, color: '#ef4444' },
      { name: 'Breakeven', value: breakeven, color: '#6b7280' },
    ];

    return {
      pairData,
      emotionData,
      sessionData,
      strategyData,
      rulesData,
      winLossData,
    };
  }, [trades]);

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
      const totalPL = trades.reduce((sum, t) => sum + Number(t.profitLoss || 0), 0);
      const wins = trades.filter(t => Number(t.profitLoss || 0) > 0).length;
      const winRate = trades.length > 0 ? (wins / trades.length) * 100 : 0;
      
      pdf.text(`Total Trades: ${trades.length}`, 20, y);
      y += 7;
      pdf.text(`Win Rate: ${Number(winRate || 0).toFixed(1)}%`, 20, y);
      y += 7;
      pdf.text(`Total P/L: ${Number(totalPL || 0).toFixed(2)} ${settings?.defaultCurrency || 'USD'}`, 20, y);
      y += 15;

      // Best Performing Pair
      if (analytics?.pairData.length > 0) {
        pdf.setFontSize(14);
        pdf.text('Top Performing Pairs', 20, y);
        y += 10;
        
        pdf.setFontSize(10);
        analytics.pairData.slice(0, 5).forEach(pair => {
          pdf.text(`${pair.pair}: ${Number(pair.pl || 0).toFixed(2)} (${Number(pair.winRate || 0).toFixed(1)}% WR, ${pair.trades} trades)`, 20, y);
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

  if (!analytics || trades.length === 0) {
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
          <p className="text-gray-400">Deep dive into your trading performance</p>
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
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.winLossData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#151922',
                  border: '1px solid #2d3748',
                  borderRadius: '8px',
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
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.rulesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#151922',
                  border: '1px solid #2d3748',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Performance by Pair */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-dark-card border border-dark-border rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Performance by Pair</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.pairData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
            <XAxis dataKey="pair" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#151922',
                border: '1px solid #2d3748',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="pl" name="Profit/Loss" fill="#f59e0b" />
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
                    {(emotion.pl || 0) >= 0 ? '+' : ''}{Number(emotion.pl || 0).toFixed(2)}
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
                          {(strategy.pl || 0) >= 0 ? '+' : ''}{Number(strategy.pl || 0).toFixed(2)}
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
