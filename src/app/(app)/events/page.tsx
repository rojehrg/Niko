'use client';

import { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Tag, Edit, Trash2 } from 'lucide-react';
import { useEventStore } from '@/lib/stores/event-store';

interface Event {
  id: string;
  title: string;
  eventDate: string;
  eventTime?: string;
  description?: string;
  category: string;
  isRecurring: boolean;
  recurringPattern?: string;
  reminderDays: number;
}

export default function EventsPage() {
  const { events, addEvent, updateEvent, deleteEvent, isLoading } = useEventStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    eventDate: '',
    eventTime: '',
    description: '',
    category: 'general',
    isRecurring: false,
    recurringPattern: 'yearly',
    reminderDays: 1
  });

  // Calculate countdown for an event
  const getCountdown = (eventDate: string, eventTime?: string) => {
    const now = new Date();
    const eventDateTime = new Date(eventDate);
    
    if (eventTime) {
      const [hours, minutes] = eventTime.split(':');
      eventDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    }
    
    const diff = eventDateTime.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diff < 0) {
      return { text: 'Past', days: 0, hours: 0, minutes: 0, isPast: true };
    }
    
    if (days > 0) {
      return { text: `${days} day${days !== 1 ? 's' : ''} away`, days, hours, minutes, isPast: false };
    } else if (hours > 0) {
      return { text: `${hours} hour${hours !== 1 ? 's' : ''} away`, days, hours, minutes, isPast: false };
    } else if (minutes > 0) {
      return { text: `${minutes} minute${minutes !== 1 ? 's' : ''} away`, days, hours, minutes, isPast: false };
    } else {
      return { text: 'Today!', days: 0, hours: 0, minutes: 0, isPast: false };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.eventDate) return;
    
    const eventData = {
      ...formData,
      id: editingEvent?.id || Date.now().toString(),
      eventDate: formData.eventDate!,
      title: formData.title!,
      category: formData.category || 'general',
      isRecurring: formData.isRecurring || false,
      reminderDays: formData.reminderDays || 1
    };
    
    if (editingEvent) {
      updateEvent(eventData.id, eventData);
    } else {
      addEvent(eventData);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      eventDate: '',
      eventTime: '',
      description: '',
      category: 'general',
      isRecurring: false,
      recurringPattern: 'yearly',
      reminderDays: 1
    });
    setEditingEvent(null);
    setIsFormOpen(false);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      eventDate: event.eventDate,
      eventTime: event.eventTime,
      description: event.description,
      category: event.category,
      isRecurring: event.isRecurring,
      recurringPattern: event.recurringPattern,
      reminderDays: event.reminderDays
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      deleteEvent(id);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'holiday': return '🎉';
      case 'birthday': return '🎂';
      case 'anniversary': return '💕';
      case 'deadline': return '⏰';
      default: return '📅';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'holiday': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'birthday': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300';
      case 'anniversary': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'deadline': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            Event Tracker
          </h1>
          <p className="text-[var(--foreground-secondary)]">
            Keep track of important dates, holidays, and events
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Event
            </button>
          </div>
        </div>

        {/* Events List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[var(--foreground-secondary)]">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-[var(--foreground-tertiary)] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">No events yet</h3>
            <p className="text-[var(--foreground-secondary)] mb-6">
              Start by adding your first event or holiday
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-6 py-3 rounded-lg transition-colors"
            >
              Add Your First Event
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {events
              .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
              .map((event) => {
                const countdown = getCountdown(event.eventDate, event.eventTime);
                return (
                  <div
                    key={event.id}
                    className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{getCategoryIcon(event.category)}</span>
                          <h3 className="text-lg font-semibold text-[var(--foreground)]">
                            {event.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                            {event.category}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-[var(--foreground-secondary)] mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(event.eventDate).toLocaleDateString()}
                          </div>
                          {event.eventTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {event.eventTime}
                            </div>
                          )}
                          {event.isRecurring && (
                            <div className="flex items-center gap-1">
                              <Tag className="w-4 h-4" />
                              {event.recurringPattern}
                            </div>
                          )}
                        </div>
                        
                        {event.description && (
                          <p className="text-[var(--foreground-secondary)] mb-3">
                            {event.description}
                          </p>
                        )}
                        
                        {/* Countdown Display */}
                        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                          countdown.isPast 
                            ? 'bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400'
                            : countdown.days === 0 
                              ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                        }`}>
                          <Clock className="w-4 h-4" />
                          {countdown.text}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(event)}
                          className="p-2 hover:bg-[var(--hover)] rounded-lg transition-colors"
                          title="Edit event"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-600 dark:text-red-400"
                          title="Delete event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Add/Edit Event Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  placeholder="Enter event title"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                    className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Time (Optional)
                  </label>
                  <input
                    type="time"
                    value={formData.eventTime}
                    onChange={(e) => setFormData({...formData, eventTime: e.target.value})}
                    className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                >
                  <option value="general">General</option>
                  <option value="holiday">Holiday</option>
                  <option value="birthday">Birthday</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="deadline">Deadline</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  rows={3}
                  placeholder="Add event details..."
                />
              </div>
              
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isRecurring}
                    onChange={(e) => setFormData({...formData, isRecurring: e.target.checked})}
                    className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                  <span className="text-sm text-[var(--foreground)]">Recurring Event</span>
                </label>
              </div>
              
              {formData.isRecurring && (
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Recurring Pattern
                  </label>
                  <select
                    value={formData.recurringPattern}
                    onChange={(e) => setFormData({...formData, recurringPattern: e.target.value})}
                    className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  >
                    <option value="yearly">Yearly</option>
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  {editingEvent ? 'Update Event' : 'Add Event'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] py-3 px-4 rounded-lg font-medium hover:bg-[var(--hover)] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
