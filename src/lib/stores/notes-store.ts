import { create } from 'zustand';
import { NotesService } from '@/lib/services/notes-service';

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
      const notes = await NotesService.getNotes();
      set({ notes, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      set({ isLoading: false });
    }
  },
  
  addNote: async (noteData) => {
    set({ isLoading: true });
    try {
      const newNote = await NotesService.createNote(noteData);
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
      const updatedNote = await NotesService.updateNote(id, updates);
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
      await NotesService.deleteNote(id);
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
      const updatedNote = await NotesService.togglePin(id, !get().notes.find(n => n.id === id)?.isPinned);
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
    return get().notes.find((note) => note.id === id);
  },
}));
