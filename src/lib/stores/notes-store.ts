import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  isPinned: boolean;
}

interface NotesStore {
  notes: Note[];
  isLoading: boolean;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  getNote: (id: string) => Note | undefined;
  fetchNotes: () => Promise<void>;
}

export const useNotesStore = create<NotesStore>((set, get) => ({
  notes: [],
  isLoading: false,
  
  fetchNotes: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notes:', error);
        throw error;
      }

      const notes = data?.map(note => ({
        id: note.id,
        title: note.title,
        content: note.content,
        color: note.color,
        tags: note.tags || [],
        isPinned: note.is_pinned,
        createdAt: new Date(note.created_at),
        updatedAt: new Date(note.updated_at),
      })) || [];

      set({ notes, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      set({ isLoading: false });
    }
  },
  
  addNote: async (noteData) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([{
          title: noteData.title,
          content: noteData.content,
          color: noteData.color,
          tags: noteData.tags,
          is_pinned: noteData.isPinned,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating note:', error);
        throw error;
      }

      const newNote = {
        id: data.id,
        title: data.title,
        content: data.content,
        color: data.color,
        tags: data.tags || [],
        isPinned: data.is_pinned,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      set((state) => ({
        notes: [newNote, ...state.notes],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to add note:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  
  updateNote: async (id: string, updates: Partial<Note>) => {
    set({ isLoading: true });
    try {
      const updateData: Record<string, unknown> = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.content !== undefined) updateData.content = updates.content;
      if (updates.color !== undefined) updateData.color = updates.color;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.isPinned !== undefined) updateData.is_pinned = updates.isPinned;

      const { data, error } = await supabase
        .from('notes')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating note:', error);
        throw error;
      }

      const updatedNote = {
        id: data.id,
        title: data.title,
        content: data.content,
        color: data.color,
        tags: data.tags || [],
        isPinned: data.is_pinned,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id ? updatedNote : note
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to update note:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  
  deleteNote: async (id: string) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting note:', error);
        throw error;
      }

      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to delete note:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  
  togglePin: async (id: string) => {
    set({ isLoading: true });
    try {
      const currentNote = get().notes.find(n => n.id === id);
      if (!currentNote) throw new Error('Note not found');

      const { data, error } = await supabase
        .from('notes')
        .update({ is_pinned: !currentNote.isPinned })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error toggling pin:', error);
        throw error;
      }

      const updatedNote = {
        id: data.id,
        title: data.title,
        content: data.content,
        color: data.color,
        tags: data.tags || [],
        isPinned: data.is_pinned,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id ? updatedNote : note
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to toggle pin:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  
  getNote: (id: string) => {
    return get().notes.find(note => note.id === id);
  },
}));
