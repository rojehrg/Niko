"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Event {
  id: string;
  emoji: string;
  name: string;
  targetDate: Date;
  isCompleted: boolean;
}

interface EventsTrackerProps {
  isCollapsed: boolean;
}

const EMOJI_OPTIONS = [
  '🎓', '📚', '💼', '🎯', '🎉', '🏠', '✈️', '🎂', '💍', '🏥',
  '🎨', '🎵', '⚽', '🎮', '🍕', '☕', '🌙', '⭐', '💝', '🎊'
];

export function EventsTracker({ isCollapsed }: EventsTrackerProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    emoji: '🎯',
    name: '',
    targetDate: new Date().toISOString().split('T')[0]
  });

  // Load events from localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem('studybuddy-events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents).map((event: any) => ({
        ...event,
        targetDate: new Date(event.targetDate)
      })));
    }
  }, []);

  // Save events to localStorage
  useEffect(() => {
    localStorage.setItem('studybuddy-events', JSON.stringify(events));
  }, [events]);

  const addEvent = () => {
    if (!newEvent.name.trim()) return;
    
    const event: Event = {
      id: Date.now().toString(),
      emoji: newEvent.emoji,
      name: newEvent.name.trim(),
      targetDate: new Date(newEvent.targetDate),
      isCompleted: false
    };

    setEvents(prev => [...prev, event]);
    setNewEvent({ emoji: '🎯', name: '', targetDate: new Date().toISOString().split('T')[0] });
    setShowAddForm(false);
  };

  const toggleEventCompletion = (id: string) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, isCompleted: !event.isCompleted } : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const getTimeUntil = (targetDate: Date) => {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    
    if (diff <= 0) return 'Now!';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (isCollapsed) {
    return (
      <div className="absolute bottom-24 left-0 right-0 flex justify-center">
        <motion.button
          onClick={() => setShowAddForm(true)}
          className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-lg">📅</span>
        </motion.button>
      </div>
    );
  }

  return (
    <div className="absolute bottom-24 left-0 right-0 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Events
        </h3>
        <motion.button
          onClick={() => setShowAddForm(true)}
          className="w-6 h-6 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center text-xs transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          +
        </motion.button>
      </div>

      {/* Events List */}
      <div className="space-y-2 max-h-36 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <AnimatePresence>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`group flex items-center space-x-3 p-2.5 rounded-xl text-xs transition-all duration-200 ${
                event.isCompleted 
                  ? 'bg-green-50 dark:bg-green-900/20 opacity-70' 
                  : 'bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
            >
              <button
                onClick={() => toggleEventCompletion(event.id)}
                className="flex-shrink-0 transition-transform hover:scale-110"
              >
                <span className="text-base">{event.emoji}</span>
              </button>
              
              <div className="flex-1 min-w-0">
                <div className={`font-medium truncate transition-all ${
                  event.isCompleted ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {event.name}
                </div>
                <div className={`text-xs font-medium ${
                  event.isCompleted ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
                }`}>
                  {getTimeUntil(event.targetDate)}
                </div>
              </div>
              
              <button
                onClick={() => deleteEvent(event.id)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {events.length === 0 && (
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 py-4">
            No events yet
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-80 max-w-[90vw] shadow-2xl border border-gray-200 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-200">
                Add New Event
              </h3>
              
              {/* Emoji Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Choose Emoji
                </label>
                <div className="grid grid-cols-10 gap-2 max-h-32 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setNewEvent(prev => ({ ...prev, emoji }))}
                      className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all duration-200 ${
                        newEvent.emoji === emoji 
                          ? 'bg-blue-500 text-white scale-110 shadow-lg' 
                          : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 hover:scale-105'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Event Name */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Name
                </label>
                <input
                  type="text"
                  value={newEvent.name}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Final Exam"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                />
              </div>
              
              {/* Target Date */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Date
                </label>
                <input
                  type="date"
                  value={newEvent.targetDate}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, targetDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                />
              </div>
              
              {/* Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={addEvent}
                  disabled={!newEvent.name.trim()}
                  className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-lg"
                >
                  Add Event
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
