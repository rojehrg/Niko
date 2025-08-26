import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface Event {
  id: string;
  title: string;
  eventDate: string;
  eventTime?: string;
  description?: string;
  category: string;
  isRecurring: boolean;
  recurringPattern?: string;
  reminderDays: number;
  createdAt?: string;
  updatedAt?: string;
}

interface EventStore {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  addEvent: (event: Event) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

export const useEventStore = create<EventStore>((set, get) => ({
  events: [],
  isLoading: false,
  error: null,

  fetchEvents: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) {
        console.error('Failed to fetch events:', error);
        // Fallback to localStorage if Supabase fails
        const storedEvents = localStorage.getItem('events');
        if (storedEvents) {
          set({ events: JSON.parse(storedEvents), isLoading: false });
        } else {
          set({ events: [], isLoading: false });
        }
        return;
      }

      // Transform Supabase data to match our interface
      const transformedEvents = (data || []).map(event => ({
        id: event.id,
        title: event.title,
        eventDate: event.event_date,
        eventTime: event.event_time,
        description: event.description,
        category: event.category,
        isRecurring: event.is_recurring,
        recurringPattern: event.recurring_pattern,
        reminderDays: event.reminder_days,
        createdAt: event.created_at,
        updatedAt: event.updated_at
      }));

      set({ events: transformedEvents, isLoading: false });
      
      // Also update localStorage as backup
      localStorage.setItem('events', JSON.stringify(transformedEvents));
      
    } catch (error) {
      console.error('Failed to fetch events:', error);
      // Fallback to localStorage
      const storedEvents = localStorage.getItem('events');
      if (storedEvents) {
        set({ events: JSON.parse(storedEvents), isLoading: false });
      } else {
        set({ events: [], isLoading: false });
      }
    }
  },

  addEvent: async (event: Event) => {
    try {
      // Try to add to Supabase first
      const { error } = await supabase
        .from('events')
        .insert({
          title: event.title,
          event_date: event.eventDate,
          event_time: event.eventTime,
          description: event.description,
          category: event.category,
          is_recurring: event.isRecurring,
          recurring_pattern: event.recurringPattern,
          reminder_days: event.reminderDays
        });

      if (error) {
        console.error('Failed to add event to Supabase:', error);
        // Fallback to localStorage
        const newEvent = { ...event, id: Date.now().toString() };
        const updatedEvents = [...get().events, newEvent];
        set({ events: updatedEvents });
        localStorage.setItem('events', JSON.stringify(updatedEvents));
        return;
      }

      // Refresh events from Supabase
      await get().fetchEvents();
      
    } catch (error) {
      console.error('Failed to add event:', error);
      // Fallback to localStorage
      const newEvent = { ...event, id: Date.now().toString() };
      const updatedEvents = [...get().events, newEvent];
      set({ events: updatedEvents });
      localStorage.setItem('events', JSON.stringify(updatedEvents));
    }
  },

  updateEvent: async (id: string, updates: Partial<Event>) => {
    try {
      // Try to update in Supabase first
      const supabaseUpdates: any = {};
      if (updates.title) supabaseUpdates.title = updates.title;
      if (updates.eventDate) supabaseUpdates.event_date = updates.eventDate;
      if (updates.eventTime !== undefined) supabaseUpdates.event_time = updates.eventTime;
      if (updates.description !== undefined) supabaseUpdates.description = updates.description;
      if (updates.category) supabaseUpdates.category = updates.category;
      if (updates.isRecurring !== undefined) supabaseUpdates.is_recurring = updates.isRecurring;
      if (updates.recurringPattern) supabaseUpdates.recurring_pattern = updates.recurringPattern;
      if (updates.reminderDays !== undefined) supabaseUpdates.reminder_days = updates.reminderDays;

      const { error } = await supabase
        .from('events')
        .update(supabaseUpdates)
        .eq('id', id);

      if (error) {
        console.error('Failed to update event in Supabase:', error);
        // Fallback to localStorage
        const updatedEvents = get().events.map(event =>
          event.id === id ? { ...event, ...updates } : event
        );
        set({ events: updatedEvents });
        localStorage.setItem('events', JSON.stringify(updatedEvents));
        return;
      }

      // Refresh events from Supabase
      await get().fetchEvents();
      
    } catch (error) {
      console.error('Failed to update event:', error);
      // Fallback to localStorage
      const updatedEvents = get().events.map(event =>
        event.id === id ? { ...event, ...updates } : event
      );
      set({ events: updatedEvents });
      localStorage.setItem('events', JSON.stringify(updatedEvents));
    }
  },

  deleteEvent: async (id: string) => {
    try {
      // Try to delete from Supabase first
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Failed to delete event from Supabase:', error);
        // Fallback to localStorage
        const updatedEvents = get().events.filter(event => event.id !== id);
        set({ events: updatedEvents });
        localStorage.setItem('events', JSON.stringify(updatedEvents));
        return;
      }

      // Refresh events from Supabase
      await get().fetchEvents();
      
    } catch (error) {
      console.error('Failed to delete event:', error);
      // Fallback to localStorage
      const updatedEvents = get().events.filter(event => event.id !== id);
      set({ events: updatedEvents });
      localStorage.setItem('events', JSON.stringify(updatedEvents));
    }
  }
}));
