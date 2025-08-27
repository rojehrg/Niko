import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';

export interface FlashcardSet {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: Date;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  setId: string;
  createdAt: Date;
  lastStudied?: Date;
}

interface FlashcardStore {
  flashcards: Flashcard[];
  sets: FlashcardSet[];
  isLoading: boolean;
  
  // Flashcard operations
  addFlashcard: (front: string, back: string, setId: string) => Promise<void>;
  removeFlashcard: (id: string) => Promise<void>;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => Promise<void>;
  getFlashcard: (id: string) => Flashcard | undefined;
  
  // Set operations
  addSet: (name: string, description?: string, color?: string) => Promise<void>;
  removeSet: (id: string) => Promise<void>;
  updateSet: (id: string, updates: Partial<FlashcardSet>) => Promise<void>;
  getSet: (id: string) => FlashcardSet | undefined;
  
  // Utility functions
  getFlashcardsBySet: (setId: string) => Flashcard[];
  fetchFlashcards: () => Promise<void>;
  fetchSets: () => Promise<void>;
}

const DEFAULT_COLORS = [
  'bg-blue-500',
  'bg-purple-500', 
  'bg-green-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-red-500'
];

export const useFlashcardStore = create<FlashcardStore>((set, get) => ({
  flashcards: [],
  sets: [],
  isLoading: false,
  
  fetchFlashcards: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching flashcards:', error);
        throw error;
      }

      const flashcards = data?.map(card => ({
        id: card.id,
        front: card.front,
        back: card.back,
        setId: card.set_id,
        createdAt: new Date(card.created_at),
        lastStudied: card.last_studied ? new Date(card.last_studied) : undefined,
      })) || [];

      set({ flashcards, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch flashcards:', error);
      set({ isLoading: false });
    }
  },

  fetchSets: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('flashcard_sets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching flashcard sets:', error);
        throw error;
      }

      const sets = data?.map(set => ({
        id: set.id,
        name: set.name,
        description: set.description,
        color: set.color,
        createdAt: new Date(set.created_at),
      })) || [];

      set({ sets, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch flashcard sets:', error);
      set({ isLoading: false });
    }
  },
  
  addFlashcard: async (front: string, back: string, setId: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .insert([{
          front,
          back,
          set_id: setId,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating flashcard:', error);
        throw error;
      }

      const newFlashcard: Flashcard = {
        id: data.id,
        front: data.front,
        back: data.back,
        setId: data.set_id,
        createdAt: new Date(data.created_at),
      };
      
      set((state) => ({
        flashcards: [newFlashcard, ...state.flashcards],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to add flashcard:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  
  removeFlashcard: async (id: string) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting flashcard:', error);
        throw error;
      }
      
      set((state) => ({
        flashcards: state.flashcards.filter((card) => card.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to remove flashcard:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  
  updateFlashcard: async (id: string, updates: Partial<Flashcard>) => {
    set({ isLoading: true });
    try {
      const updateData: Record<string, unknown> = {};
      
      if (updates.front !== undefined) updateData.front = updates.front;
      if (updates.back !== undefined) updateData.back = updates.back;
      if (updates.setId !== undefined) updateData.set_id = updates.setId;
      if (updates.lastStudied !== undefined) updateData.last_studied = updates.lastStudied;

      const { data, error } = await supabase
        .from('flashcards')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating flashcard:', error);
        throw error;
      }

      const updatedFlashcard = {
        id: data.id,
        front: data.front,
        back: data.back,
        setId: data.set_id,
        createdAt: new Date(data.created_at),
        lastStudied: data.last_studied ? new Date(data.last_studied) : undefined,
      };

      set((state) => ({
        flashcards: state.flashcards.map((card) =>
          card.id === id ? updatedFlashcard : card
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to update flashcard:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  
  getFlashcard: (id: string) => {
    return get().flashcards.find(card => card.id === id);
  },
  
  addSet: async (name: string, description?: string, color?: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('flashcard_sets')
        .insert([{
          name,
          description,
          color: color || DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)],
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating flashcard set:', error);
        throw error;
      }

      const newSet: FlashcardSet = {
        id: data.id,
        name: data.name,
        description: data.description,
        color: data.color,
        createdAt: new Date(data.created_at),
      };
      
      set((state) => ({
        sets: [...state.sets, newSet],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to add flashcard set:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  
  removeSet: async (id: string) => {
    set({ isLoading: true });
    try {
      // First delete all flashcards in this set
      const { error: flashcardError } = await supabase
        .from('flashcards')
        .delete()
        .eq('set_id', id);

      if (flashcardError) {
        console.error('Error deleting flashcards in set:', flashcardError);
        throw flashcardError;
      }

      // Then delete the set
      const { error: setError } = await supabase
        .from('flashcard_sets')
        .delete()
        .eq('id', id);

      if (setError) {
        console.error('Error deleting flashcard set:', setError);
        throw setError;
      }
      
      set((state) => ({
        sets: state.sets.filter(set => set.id !== id),
        flashcards: state.flashcards.filter(card => card.setId !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to remove flashcard set:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  
  updateSet: async (id: string, updates: Partial<FlashcardSet>) => {
    set({ isLoading: true });
    try {
      const updateData: Record<string, unknown> = {};
      
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.color !== undefined) updateData.color = updates.color;

      const { data, error } = await supabase
        .from('flashcard_sets')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating flashcard set:', error);
        throw error;
      }

      const updatedSet = {
        id: data.id,
        name: data.name,
        description: data.description,
        color: data.color,
        createdAt: new Date(data.created_at),
      };

      set((state) => ({
        sets: state.sets.map((set) =>
          set.id === id ? updatedSet : set
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to update flashcard set:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  
  getSet: (id: string) => {
    return get().sets.find(set => set.id === id);
  },
  
  getFlashcardsBySet: (setId: string) => {
    return get().flashcards.filter(card => card.setId === setId);
  },
}));
