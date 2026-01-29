import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  PenSquare,
  ShieldCheck,
  Settings,
  Menu,
  X,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/journal', label: 'Journal', icon: BookOpen },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/reflection', label: 'Reflection', icon: PenSquare },
    { path: '/rules', label: 'Rules', icon: ShieldCheck },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden sticky top-0 z-50 bg-dark-card border-b border-dark-border">
        <div className="flex items-center justify-between h-14 px-4">
          <Link to="/dashboard" className="flex items-center space-x-2 group">
            <div className="bg-gold-500 p-2 rounded-lg group-hover:bg-gold-600 transition-colors">
              <TrendingUp className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Trading Journal Pro+</h1>
              <p className="text-[10px] text-gray-400">Professional Trading Analytics</p>
            </div>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-dark-hover transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Out */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 md:hidden"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            className="relative h-full w-72 bg-dark-card border-r border-dark-border"
          >
            <div className="p-4 border-b border-dark-border">
              <Link to="/dashboard" className="flex items-center space-x-3 group">
                <div className="bg-gold-500 p-2 rounded-lg group-hover:bg-gold-600 transition-colors">
                  <TrendingUp className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">Trading Journal Pro+</h1>
                  <p className="text-xs text-gray-400">Professional Trading Analytics</p>
                </div>
              </Link>
            </div>
            <div className="p-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2.5 mb-1 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gold-500 text-black font-semibold'
                        : 'text-gray-300 hover:bg-dark-hover hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.aside>
        </motion.div>
      )}

      {/* Desktop Sidebar */}
      <motion.aside
        layout
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`hidden md:flex md:flex-col md:sticky md:top-0 md:h-screen bg-dark-card border-r border-dark-border z-40 transition-[width] duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="h-16 px-4 flex items-center justify-between border-b border-dark-border">
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="bg-gold-500 p-2 rounded-lg group-hover:bg-gold-600 transition-colors">
              <TrendingUp className="w-5 h-5 text-black" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-base font-bold text-white">Trading Journal Pro+</h1>
                <p className="text-[10px] text-gray-400">Professional Trading Analytics</p>
              </div>
            )}
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-dark-hover transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="flex-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link key={item.path} to={item.path} className="relative block">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center ${
                    isCollapsed ? 'justify-center' : 'space-x-3'
                  } px-3 py-2.5 mb-1 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gold-500 text-black font-semibold'
                      : 'text-gray-300 hover:bg-dark-hover hover:text-white'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5" />
                  {!isCollapsed && <span>{item.label}</span>}
                </motion.div>
                {isActive && !isCollapsed && (
                  <motion.div
                    layoutId="activeSidebarItem"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-r bg-gold-500"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </motion.aside>
    </>
  );
};

export default Navbar;
