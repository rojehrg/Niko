import { create } from 'zustand';

export interface Event {
  id: string;
  emoji: string;
  name: string;
  date: string; // MM-DD format
  description?: string;
  isRecurring: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface EventStore {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEvent: (id: string, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  getTimeUntilEvent: (date: string) => string;
  getUpcomingEvents: () => Event[];
}

export const useEventStore = create<EventStore>((set, get) => ({
  events: [],
  isLoading: false,
  error: null,

  fetchEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      // Try to fetch from Supabase first
      // For now, fallback to localStorage
      const stored = localStorage.getItem('studybuddy-events');
      if (stored) {
        set({ events: JSON.parse(stored), isLoading: false });
      } else {
        set({ events: [], isLoading: false });
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
      set({ error: 'Failed to fetch events', isLoading: false });
    }
  },

  addEvent: async (event) => {
    try {
      const newEvent: Event = {
        ...event,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedEvents = [...get().events, newEvent];
      set({ events: updatedEvents });
      
      // Store in localStorage for now
      localStorage.setItem('studybuddy-events', JSON.stringify(updatedEvents));
      
      // TODO: Add Supabase integration
      // await supabase.from('events').insert(newEvent);
    } catch (error) {
      console.error('Failed to add event:', error);
      set({ error: 'Failed to add event' });
    }
  },

  updateEvent: async (id, updates) => {
    try {
      const updatedEvents = get().events.map(event =>
        event.id === id 
          ? { ...event, ...updates, updatedAt: new Date().toISOString() }
          : event
      );
      
      set({ events: updatedEvents });
      localStorage.setItem('studybuddy-events', JSON.stringify(updatedEvents));
      
      // TODO: Add Supabase integration
      // await supabase.from('events').update(updates).eq('id', id);
    } catch (error) {
      console.error('Failed to update event:', error);
      set({ error: 'Failed to update event' });
    }
  },

  deleteEvent: async (id) => {
    try {
      const updatedEvents = get().events.filter(event => event.id !== id);
      set({ events: updatedEvents });
      localStorage.setItem('studybuddy-events', JSON.stringify(updatedEvents));
      
      // TODO: Add Supabase integration
      // await supabase.from('events').delete().eq('id', id);
    } catch (error) {
      console.error('Failed to delete event:', error);
      set({ error: 'Failed to delete event' });
    }
  },

  getTimeUntilEvent: (date: string) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Parse the date and set to current year
    const [month, day] = date.split('-');
    let eventDate = new Date(currentYear, parseInt(month) - 1, parseInt(day), 23, 59, 59);
    
    // If the date has passed this year, set it to next year
    if (eventDate < now) {
      eventDate = new Date(currentYear + 1, parseInt(month) - 1, parseInt(day), 23, 59, 59);
    }
    
    const timeDiff = eventDate.getTime() - now.getTime();
    
    if (timeDiff <= 0) {
      return '🎉 Today!';
    }
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return 'Less than 1m';
    }
  },

  getUpcomingEvents: () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    return get().events
      .map(event => {
        const [month, day] = event.date.split('-');
        let eventDate = new Date(currentYear, parseInt(month) - 1, parseInt(day));
        
        if (eventDate < now) {
          eventDate = new Date(currentYear + 1, parseInt(month) - 1, parseInt(day));
        }
        
        return { ...event, nextDate: eventDate };
      })
      .sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime())
      .slice(0, 5); // Show next 5 upcoming events
  },
}));
