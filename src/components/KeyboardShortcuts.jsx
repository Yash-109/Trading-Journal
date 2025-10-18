import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const KeyboardShortcuts = () => {
  const navigate = useNavigate();
  const { saveToLocal } = useApp();

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + S: Save data
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveToLocal();
        return;
      }

      // Ctrl/Cmd + K: Open search (future feature)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toast('Search feature coming soon!', { icon: '🔍' });
        return;
      }

      // Alt + 1-6: Navigate to pages
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        switch (e.key) {
          case '1':
            navigate('/');
            toast.success('Dashboard');
            break;
          case '2':
            navigate('/journal');
            toast.success('Trade Journal');
            break;
          case '3':
            navigate('/analytics');
            toast.success('Analytics');
            break;
          case '4':
            navigate('/reflection');
            toast.success('Daily Reflection');
            break;
          case '5':
            navigate('/rules');
            toast.success('Trading Rules');
            break;
          case '6':
            navigate('/settings');
            toast.success('Settings');
            break;
          default:
            break;
        }
      }

      // Show shortcuts help (Ctrl/Cmd + /)
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        toast(
          (t) => (
            <div className="text-sm">
              <p className="font-bold mb-2">⌨️ Keyboard Shortcuts</p>
              <ul className="space-y-1 text-xs">
                <li><kbd>Ctrl+S</kbd> - Save data locally</li>
                <li><kbd>Alt+1-6</kbd> - Navigate pages</li>
                <li><kbd>Ctrl+/</kbd> - Show this help</li>
              </ul>
            </div>
          ),
          { duration: 5000 }
        );
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate, saveToLocal]);

  return null; // This component doesn't render anything
};

export default KeyboardShortcuts;
