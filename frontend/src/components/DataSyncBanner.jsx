import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, HardDrive, Smartphone, Laptop } from 'lucide-react';
import { useApp } from '../context/AppContext';

const DataSyncBanner = () => {
  const { saveToLocal, trades } = useApp();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the banner
    const isDismissed = localStorage.getItem('dataSyncBannerDismissed');
    if (isDismissed) {
      setDismissed(true);
      return;
    }

    // Show banner if user has data but hasn't saved in a while
    const lastSaved = localStorage.getItem('lastSaved');
    if (trades.length > 0) {
      if (!lastSaved) {
        setShow(true);
      } else {
        const timeSinceLastSave = Date.now() - new Date(lastSaved).getTime();
        const hoursSinceLastSave = timeSinceLastSave / (1000 * 60 * 60);
        if (hoursSinceLastSave > 24) {
          setShow(true);
        }
      }
    }
  }, [trades]);

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('dataSyncBannerDismissed', 'true');
    setDismissed(true);
  };

  const handleSaveNow = async () => {
    await saveToLocal();
    setShow(false);
  };

  if (dismissed || !show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-16 left-0 right-0 z-40 px-4 py-2"
        >
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-4 shadow-lg backdrop-blur-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-yellow-400 mb-1">
                      💾 Data Stored Locally on This Device
                    </h3>
                    <p className="text-xs text-gray-300 mb-2">
                      Your trading journal is saved in your browser. To access it on other devices:
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <div className="flex items-center space-x-1 bg-yellow-500/10 px-2 py-1 rounded">
                        <Laptop className="w-3 h-3 text-yellow-400" />
                        <span className="text-gray-300">Save on Laptop</span>
                      </div>
                      <span className="text-gray-500">→</span>
                      <div className="flex items-center space-x-1 bg-yellow-500/10 px-2 py-1 rounded">
                        <HardDrive className="w-3 h-3 text-yellow-400" />
                        <span className="text-gray-300">Download Backup</span>
                      </div>
                      <span className="text-gray-500">→</span>
                      <div className="flex items-center space-x-1 bg-yellow-500/10 px-2 py-1 rounded">
                        <Smartphone className="w-3 h-3 text-yellow-400" />
                        <span className="text-gray-300">Upload on Phone</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={handleSaveNow}
                        className="text-xs bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-3 py-1 rounded transition-colors"
                      >
                        Save Now
                      </button>
                      <a
                        href="/settings"
                        className="text-xs text-yellow-400 hover:text-yellow-300 underline"
                      >
                        Learn More
                      </a>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="text-gray-400 hover:text-white ml-2 flex-shrink-0"
                  title="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DataSyncBanner;
