"use client";

import { useState, useEffect } from "react";
import { useEventStore, Event } from "@/lib/stores/holiday-store";
import { Plus, Edit, Trash2, Calendar, Clock, Star } from "lucide-react";

export default function EventsPage() {
  const { 
    events, 
    isLoading, 
    fetchEvents, 
    addEvent, 
    updateEvent, 
    deleteEvent,
    getTimeUntilEvent,
    getUpcomingEvents
  } = useEventStore();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState({
    emoji: '🎉',
    name: '',
    date: '',
    description: '',
    isRecurring: false
  });
  const [timeLeft, setTimeLeft] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Update timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      const timers: Record<string, string> = {};
      events.forEach(event => {
        timers[event.id] = getTimeUntilEvent(event.date);
      });
      setTimeLeft(timers);
    }, 1000);

    return () => clearInterval(interval);
  }, [events, getTimeUntilEvent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEvent.name || !newEvent.date) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, newEvent);
        setEditingEvent(null);
      } else {
        await addEvent({
          ...newEvent,
          userId: 'user-1' // TODO: Get from auth context
        });
      }
      
      setNewEvent({ emoji: '🎉', name: '', date: '', description: '', isRecurring: false });
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setNewEvent({
      emoji: event.emoji,
      name: event.name,
      date: event.date,
      description: event.description || '',
      isRecurring: event.isRecurring
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(id);
    }
  };

  const upcomingEvents = getUpcomingEvents();

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[var(--foreground)] tracking-tight mb-3">
          Event Tracker
        </h1>
        <p className="text-lg text-[var(--foreground-secondary)] font-medium">
          Never miss important dates and events
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[var(--background-secondary)] p-6 rounded-xl border border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{events.length}</p>
              <p className="text-sm text-[var(--foreground-secondary)]">Total Events</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--background-secondary)] p-6 rounded-xl border border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{upcomingEvents.length}</p>
              <p className="text-sm text-[var(--foreground-secondary)]">Upcoming</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--background-secondary)] p-6 rounded-xl border border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {events.filter(e => e.isRecurring).length}
              </p>
              <p className="text-sm text-[var(--foreground-secondary)]">Recurring</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--background-secondary)] p-6 rounded-xl border border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {events.filter(e => timeLeft[e.id]?.includes('Today')).length}
              </p>
              <p className="text-sm text-[var(--foreground-secondary)]">Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Button */}
      <div className="mb-8">
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Add New Event
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="text-center py-16 bg-[var(--background-secondary)] rounded-xl border border-[var(--border)]">
            <Calendar className="w-16 h-16 text-[var(--foreground-tertiary)] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
              No events yet
            </h3>
            <p className="text-[var(--foreground-secondary)] mb-6">
              Start by adding your first event to stay organized
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
            >
              Add Your First Event
            </button>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="bg-[var(--background-secondary)] p-6 rounded-xl border border-[var(--border)] hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{event.emoji}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--foreground)] mb-1">
                      {event.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-[var(--foreground-secondary)]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {event.date}
                      </span>
                      {event.isRecurring && (
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs">
                          Recurring
                        </span>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-[var(--foreground-secondary)] mt-2">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[var(--primary)]">
                      {timeLeft[event.id] || 'Loading...'}
                    </div>
                    <div className="text-sm text-[var(--foreground-secondary)]">
                      {timeLeft[event.id]?.includes('Today') ? '🎉 Today!' : 'Time remaining'}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="p-2 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--hover)] rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Event Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--background)] rounded-2xl shadow-2xl border border-[var(--border)] w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-6">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Emoji Picker */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-3">
                    Emoji
                  </label>
                  <div className="grid grid-cols-8 gap-2">
                    {['🎉', '🎃', '🦃', '🎄', '🎊', '🎈', '🎁', '⭐', '🌙', '☀️', '🌸', '🍁', '❄️', '🔥', '💫', '✨', '🎂', '💝', '🏆', '🎓', '💍', '🚗', '✈️', '🏠', '🐕', '🐱'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setNewEvent({ ...newEvent, emoji })}
                        className={`p-3 rounded-xl text-xl hover:scale-110 transition-all ${
                          newEvent.emoji === emoji 
                            ? 'bg-[var(--primary)] text-white scale-110' 
                            : 'bg-[var(--background-secondary)] hover:bg-[var(--hover)]'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-2">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    value={newEvent.name}
                    onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                    placeholder="e.g., My Birthday"
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--background-secondary)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    required
                  />
                </div>
                
                {/* Date Input */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-2">
                    Date (MM-DD) *
                  </label>
                  <input
                    type="text"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    placeholder="12-25"
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--background-secondary)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-[var(--foreground-tertiary)] mt-1">
                    Format: MM-DD (e.g., 12-25 for December 25th)
                  </p>
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Add any additional details..."
                    rows={3}
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--background-secondary)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none"
                  />
                </div>

                {/* Recurring Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="recurring"
                    checked={newEvent.isRecurring}
                    onChange={(e) => setNewEvent({ ...newEvent, isRecurring: e.target.checked })}
                    className="w-4 h-4 text-[var(--primary)] bg-[var(--background-secondary)] border-[var(--border)] rounded focus:ring-[var(--primary)] focus:ring-2"
                  />
                  <label htmlFor="recurring" className="text-sm text-[var(--foreground-secondary)]">
                    This event repeats every year
                  </label>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      setEditingEvent(null);
                      setNewEvent({ emoji: '🎉', name: '', date: '', description: '', isRecurring: false });
                    }}
                    className="flex-1 px-4 py-3 border border-[var(--border)] rounded-xl text-[var(--foreground)] hover:bg-[var(--hover)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-3 rounded-xl font-medium transition-colors"
                  >
                    {editingEvent ? 'Update' : 'Add'} Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
