import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  Activity,
  Award,
  AlertCircle,
  Calendar,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, isAfter, isBefore, parseISO } from 'date-fns';

const Dashboard = () => {
  const { trades = [], reflections = [] } = useApp();

  // Calculate statistics
  const stats = useMemo(() => {
    if (!trades || trades.length === 0) {
      return {
        totalTrades: 0,
        winRate: 0,
        avgRR: 0,
        totalProfit: 0,
        winningTrades: 0,
        losingTrades: 0,
        bestTrade: 0,
        worstTrade: 0,
        avgProfit: 0,
        consistencyScore: 0,
        currentStreak: 0,
        streakType: 'none',
      };
    }

    const winningTrades = trades.filter(t => (t.profitLoss || 0) > 0);
    const losingTrades = trades.filter(t => (t.profitLoss || 0) < 0);
    const totalProfit = trades.reduce((sum, t) => sum + (t.profitLoss || 0), 0);
    const avgRR = trades.reduce((sum, t) => sum + (t.rr || 0), 0) / trades.length;
    const rulesFollowed = trades.filter(t => t.ruleFollowed).length;
    const consistencyScore = (rulesFollowed / trades.length) * 100;

    // Calculate streak
    const sortedTrades = [...trades].sort((a, b) => new Date(b.date) - new Date(a.date));
    let currentStreak = 0;
    let streakType = 'none';
    
    if (sortedTrades.length > 0) {
      const isWin = (sortedTrades[0].profitLoss || 0) > 0;
      streakType = isWin ? 'win' : 'loss';
      
      for (let trade of sortedTrades) {
        if (isWin && (trade.profitLoss || 0) > 0) {
          currentStreak++;
        } else if (!isWin && (trade.profitLoss || 0) < 0) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    return {
      totalTrades: trades.length,
      winRate: trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0,
      avgRR,
      totalProfit,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      bestTrade: trades.length > 0 ? Math.max(...trades.map(t => t.profitLoss || 0)) : 0,
      worstTrade: trades.length > 0 ? Math.min(...trades.map(t => t.profitLoss || 0)) : 0,
      avgProfit: trades.length > 0 ? totalProfit / trades.length : 0,
      consistencyScore,
      currentStreak,
      streakType,
    };
  }, [trades]);

  // Equity curve data
  const equityData = useMemo(() => {
    if (!trades || trades.length === 0) return [];
    
    const sortedTrades = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date));
    let cumulative = 0;
    
    return sortedTrades.map((trade, index) => {
      cumulative += (trade.profitLoss || 0);
      return {
        date: format(new Date(trade.date), 'MMM dd'),
        equity: cumulative,
        trade: index + 1,
      };
    });
  }, [trades]);

  // Recent trades
  const recentTrades = useMemo(() => {
    if (!trades || trades.length === 0) return [];
    
    return [...trades]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [trades]);

  // Trading quotes
  const quotes = [
    "Discipline is the bridge between goals and accomplishment.",
    "The market is a device for transferring money from the impatient to the patient.",
    "Risk comes from not knowing what you're doing.",
    "The goal of a successful trader is to make the best trades. Money is secondary.",
    "Your trading system is only as good as your ability to follow it.",
    "Loss is part of the game. Accept it and move forward.",
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's your trading overview.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Today</p>
          <p className="text-lg font-semibold text-white">{format(new Date(), 'MMMM dd, yyyy')}</p>
        </div>
      </div>

      {/* Daily Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gold-500/10 to-gold-600/5 border border-gold-500/20 rounded-xl p-6"
      >
        <div className="flex items-start space-x-3">
          <Award className="w-6 h-6 text-gold-500 mt-1" />
          <div>
            <p className="text-gray-300 italic">"{randomQuote}"</p>
            <p className="text-sm text-gray-500 mt-2">Daily Trading Wisdom</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Trades"
          value={stats.totalTrades}
          icon={BarChart3}
          color="blue"
        />
        <StatCard
          title="Win Rate"
          value={`${Number(stats.winRate || 0).toFixed(1)}%`}
          icon={Target}
          color={stats.winRate >= 50 ? 'profit' : 'loss'}
        />
        <StatCard
          title="Average R:R"
          value={`1:${Number(stats.avgRR || 0).toFixed(2)}`}
          icon={Activity}
          color="gold"
        />
        <StatCard
          title="Total P/L"
          value={`${stats.totalProfit >= 0 ? '+' : ''}${Number(stats.totalProfit || 0).toFixed(2)}`}
          icon={DollarSign}
          color={stats.totalProfit >= 0 ? 'profit' : 'loss'}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-card border border-dark-border rounded-xl p-6"
        >
          <h3 className="text-gray-400 text-sm font-medium mb-4">Trade Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Winning Trades</span>
              <span className="text-profit font-semibold">{stats.winningTrades}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Losing Trades</span>
              <span className="text-loss font-semibold">{stats.losingTrades}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Best Trade</span>
              <span className="text-profit font-semibold">+{Number(stats.bestTrade || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Worst Trade</span>
              <span className="text-loss font-semibold">{Number(stats.worstTrade || 0).toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-card border border-dark-border rounded-xl p-6"
        >
          <h3 className="text-gray-400 text-sm font-medium mb-4">Performance Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Consistency Score</span>
              <span className="text-gold-500 font-semibold">{Number(stats.consistencyScore || 0).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Avg Profit/Trade</span>
              <span className={`font-semibold ${stats.avgProfit >= 0 ? 'text-profit' : 'text-loss'}`}>
                {stats.avgProfit >= 0 ? '+' : ''}{Number(stats.avgProfit || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Current Streak</span>
              <span className={`font-semibold ${stats.streakType === 'win' ? 'text-profit' : stats.streakType === 'loss' ? 'text-loss' : 'text-gray-400'}`}>
                {stats.currentStreak} {stats.streakType === 'win' ? '🔥' : stats.streakType === 'loss' ? '❄️' : '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Journal Entries</span>
              <span className="text-blue-500 font-semibold">{reflections.length}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-dark-card border border-dark-border rounded-xl p-6"
        >
          <h3 className="text-gray-400 text-sm font-medium mb-4">Quick Insights</h3>
          <div className="space-y-3">
            {stats.consistencyScore < 70 && (
              <div className="flex items-start space-x-2 text-sm">
                <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                <span className="text-gray-300">Focus on following your trading rules</span>
              </div>
            )}
            {stats.winRate < 50 && (
              <div className="flex items-start space-x-2 text-sm">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                <span className="text-gray-300">Win rate below 50% - review your strategy</span>
              </div>
            )}
            {stats.streakType === 'loss' && stats.currentStreak >= 3 && (
              <div className="flex items-start space-x-2 text-sm">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                <span className="text-gray-300">Consider reducing position size</span>
              </div>
            )}
            {stats.totalProfit >= 0 && (
              <div className="flex items-start space-x-2 text-sm">
                <Award className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-gray-300">Great job! You're profitable</span>
              </div>
            )}
            {stats.avgRR >= 2 && (
              <div className="flex items-start space-x-2 text-sm">
                <Award className="w-4 h-4 text-gold-500 mt-0.5" />
                <span className="text-gray-300">Excellent risk management!</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Equity Curve */}
      {equityData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-dark-card border border-dark-border rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Equity Curve</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={equityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#151922',
                  border: '1px solid #2d3748',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#e5e7eb' }}
              />
              <Line
                type="monotone"
                dataKey="equity"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: '#f59e0b', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Recent Trades */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-dark-card border border-dark-border rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Recent Trades</h3>
        {recentTrades.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No trades yet. Start logging your trades!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Date</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Pair</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Direction</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">P/L</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">R:R</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Emotion</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Rules</th>
                </tr>
              </thead>
              <tbody>
                {recentTrades.map((trade) => (
                  <tr key={trade.id} className="border-b border-dark-border/50 hover:bg-dark-hover transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-300">
                      {format(new Date(trade.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-white">{trade.pair}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        trade.direction === 'Buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {trade.direction}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-sm font-semibold ${(trade.profitLoss || 0) >= 0 ? 'text-profit' : 'text-loss'}`}>
                      {(trade.profitLoss || 0) >= 0 ? '+' : ''}{Number(trade.profitLoss || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-300">1:{Number(trade.rr || 0).toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{trade.emotion}</td>
                    <td className="py-3 px-4 text-sm">
                      {trade.ruleFollowed ? (
                        <span className="text-green-400">✓</span>
                      ) : (
                        <span className="text-red-400">✗</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
