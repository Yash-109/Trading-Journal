import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'gold' }) => {
  const colorClasses = {
    gold: 'from-gold-500/10 to-gold-600/5 border-gold-500/20',
    profit: 'from-green-500/10 to-green-600/5 border-green-500/20',
    loss: 'from-red-500/10 to-red-600/5 border-red-500/20',
    blue: 'from-blue-500/10 to-blue-600/5 border-blue-500/20',
  };

  const iconColorClasses = {
    gold: 'text-gold-500',
    profit: 'text-profit',
    loss: 'text-loss',
    blue: 'text-blue-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-6 card-hover`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
          {trend && (
            <div className={`flex items-center space-x-1 text-sm ${trend === 'up' ? 'text-profit' : 'text-loss'}`}>
              <span>{trendValue}</span>
              <span className="text-gray-500">vs last period</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg bg-dark-card/50 ${iconColorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
