import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { format, parseISO } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Edit2, 
  Trash2, 
  X,
  Smile,
  Meh,
  Frown
} from 'lucide-react';

const Reflection = () => {
  const { reflections = [], addReflection, deleteReflection } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    whatWentWell: '',
    mistakes: '',
    improvement: '',
    mood: 'neutral',
    emotionalBalance: 5,
  });

  // Get reflection for selected date
  const currentReflection = useMemo(() => {
    return reflections.find(r => r.date === selectedDate);
  }, [reflections, selectedDate]);

  // Mood emojis
  const moodEmojis = {
    great: '😊',
    good: '🙂',
    neutral: '😐',
    bad: '😟',
    terrible: '😢',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addReflection(formData);
    setIsModalOpen(false);
    setSelectedDate(formData.date);
  };

  const handleEdit = () => {
    if (currentReflection) {
      setFormData(currentReflection);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async () => {
    if (currentReflection && window.confirm('Are you sure you want to delete this reflection?')) {
      const id = currentReflection._id || currentReflection.id;
      await deleteReflection(id);
    }
  };

  const handleNewReflection = () => {
    setFormData({
      date: selectedDate,
      whatWentWell: '',
      mistakes: '',
      improvement: '',
      mood: 'neutral',
      emotionalBalance: 5,
    });
    setIsModalOpen(true);
  };

  // Reflection prompts
  const prompts = [
    {
      question: "What went well today?",
      placeholder: "List your wins, good decisions, and what you executed correctly...",
      field: 'whatWentWell',
    },
    {
      question: "What mistakes did I make or rules did I break?",
      placeholder: "Be honest about errors, impulsive decisions, or rule violations...",
      field: 'mistakes',
    },
    {
      question: "What will I do better tomorrow?",
      placeholder: "Action items, specific improvements, and commitments for next trading day...",
      field: 'improvement',
    },
  ];

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Daily Reflection</h1>
          <p className="text-gray-400">Track your mindset and trading discipline</p>
        </div>
        <button onClick={handleNewReflection} className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>New Reflection</span>
        </button>
      </div>

      {/* Date Selector & Calendar View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 bg-dark-card border border-dark-border rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-gold-500" />
            <span>Select Date</span>
          </h3>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent mb-4"
          />

          {/* Recent Reflections */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-400 mb-3">Recent Entries</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {reflections
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 10)
                .map((reflection) => (
                  <button
                    key={reflection.date}
                    onClick={() => setSelectedDate(reflection.date)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedDate === reflection.date
                        ? 'bg-gold-500 text-black'
                        : 'bg-dark-bg hover:bg-dark-hover text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {format(new Date(reflection.date), 'MMM dd, yyyy')}
                      </span>
                      <span className="text-lg">{moodEmojis[reflection.mood]}</span>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </motion.div>

        {/* Reflection Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-dark-card border border-dark-border rounded-xl p-6"
        >
          {currentReflection ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {format(new Date(currentReflection.date), 'EEEE, MMMM dd, yyyy')}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400 text-sm">Mood:</span>
                      <span className="text-2xl">{moodEmojis[currentReflection.mood]}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400 text-sm">Emotional Balance:</span>
                      <span className="text-gold-500 font-semibold">
                        {currentReflection.emotionalBalance}/10
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleEdit}
                    className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-gold-500" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-4">
                  <h3 className="text-green-400 font-semibold mb-2 flex items-center space-x-2">
                    <Smile className="w-5 h-5" />
                    <span>What Went Well</span>
                  </h3>
                  <p className="text-gray-300 whitespace-pre-wrap">{currentReflection.whatWentWell}</p>
                </div>

                <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-xl p-4">
                  <h3 className="text-red-400 font-semibold mb-2 flex items-center space-x-2">
                    <Frown className="w-5 h-5" />
                    <span>Mistakes & Rule Violations</span>
                  </h3>
                  <p className="text-gray-300 whitespace-pre-wrap">{currentReflection.mistakes}</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4">
                  <h3 className="text-blue-400 font-semibold mb-2 flex items-center space-x-2">
                    <Meh className="w-5 h-5" />
                    <span>Improvements for Tomorrow</span>
                  </h3>
                  <p className="text-gray-300 whitespace-pre-wrap">{currentReflection.improvement}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <CalendarIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Reflection for This Date</h3>
              <p className="text-gray-400 mb-6">Start documenting your trading journey</p>
              <button onClick={handleNewReflection} className="btn-primary">
                Create Reflection
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Reflection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 transition-opacity modal-backdrop"
                onClick={() => setIsModalOpen(false)}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-dark-card rounded-xl shadow-2xl transform transition-all sm:max-w-3xl sm:w-full border border-dark-border max-h-[90vh] overflow-y-auto"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-dark-border sticky top-0 bg-dark-card z-10">
                  <h2 className="text-2xl font-bold text-white">Daily Reflection</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 rounded-lg hover:bg-dark-hover transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Mood */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      How was your overall mood today?
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                      {Object.entries(moodEmojis).map(([mood, emoji]) => (
                        <button
                          key={mood}
                          type="button"
                          onClick={() => setFormData({ ...formData, mood })}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            formData.mood === mood
                              ? 'border-gold-500 bg-gold-500/20'
                              : 'border-dark-border bg-dark-bg hover:border-gray-600'
                          }`}
                        >
                          <div className="text-3xl mb-1">{emoji}</div>
                          <div className="text-xs text-gray-400 capitalize">{mood}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Emotional Balance */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Emotional Balance: {formData.emotionalBalance}/10
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.emotionalBalance}
                      onChange={(e) => setFormData({ ...formData, emotionalBalance: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Emotional</span>
                      <span>Balanced</span>
                    </div>
                  </div>

                  {/* Reflection Questions */}
                  {prompts.map((prompt, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {prompt.question}
                      </label>
                      <textarea
                        value={formData[prompt.field]}
                        onChange={(e) => setFormData({ ...formData, [prompt.field]: e.target.value })}
                        placeholder={prompt.placeholder}
                        rows="4"
                        className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none"
                        required
                      />
                    </div>
                  ))}

                  {/* Actions */}
                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-dark-border">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Save Reflection
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reflection;
