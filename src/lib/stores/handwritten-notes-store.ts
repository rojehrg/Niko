import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export interface HandwrittenNote {
  id: string
  title: string
  description: string
  tags: string[]
  setId: string | null
  imageUrl: string
  createdAt: string
  updatedAt: string
}

export interface HandwrittenNoteInput {
  title: string
  description: string
  tags: string[]
  setId: string | null
  imageUrl: string
  file: File
}

export interface HandwrittenNoteSet {
  id: string
  name: string
  description: string
  noteCount: number
  createdAt: string
  updatedAt: string
}

interface HandwrittenNotesStore {
  notes: HandwrittenNote[]
  sets: HandwrittenNoteSet[]
  isLoading: boolean
  error: string | null
  
  // Notes actions
  fetchNotes: () => Promise<void>
  addNote: (note: HandwrittenNoteInput) => Promise<void>
  updateNote: (id: string, updates: Partial<HandwrittenNote>) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  
  // Sets actions
  fetchSets: () => Promise<void>
  createSet: (set: Omit<HandwrittenNoteSet, 'id' | 'noteCount' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateSet: (id: string, updates: Partial<HandwrittenNoteSet>) => Promise<void>
  deleteSet: (id: string) => Promise<void>
  
  // Utility actions
  clearError: () => void
}

export const useHandwrittenNotesStore = create<HandwrittenNotesStore>((set, get) => ({
  notes: [],
  sets: [],
  isLoading: false,
  error: null,

  // Fetch all notes
  fetchNotes: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('handwritten_notes')
        .select('*')
        .order('createdAt', { ascending: false })

      if (error) throw error

      set({ notes: data || [], isLoading: false })
    } catch (error) {
      console.error('Error fetching notes:', error)
      set({ error: 'Failed to fetch notes', isLoading: false })
    }
  },

  // Add a new note
  addNote: async (noteData) => {
    set({ isLoading: true, error: null })
    try {
      // First, upload the image to Supabase Storage
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('handwritten-notes')
        .upload(fileName, noteData.file)

      if (uploadError) throw uploadError

      // Get the public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from('handwritten-notes')
        .getPublicUrl(fileName)

      // Create the note record in the database
      const { data, error } = await supabase
        .from('handwritten_notes')
        .insert({
          title: noteData.title,
          description: noteData.description,
          tags: noteData.tags,
          setId: noteData.setId,
          imageUrl: urlData.publicUrl,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      // Update the sets note count if a set was specified
      if (noteData.setId) {
        const currentSet = get().sets.find(s => s.id === noteData.setId)
        if (currentSet) {
          await supabase
            .from('handwritten_note_sets')
            .update({ noteCount: currentSet.noteCount + 1 })
            .eq('id', noteData.setId)
        }
      }

      set(state => ({
        notes: [data, ...state.notes],
        isLoading: false
      }))
    } catch (error) {
      console.error('Error adding note:', error)
      set({ error: 'Failed to add note', isLoading: false })
    }
  },

  // Update a note
  updateNote: async (id, updates) => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('handwritten_notes')
        .update({
          ...updates,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      set(state => ({
        notes: state.notes.map(note => 
          note.id === id ? { ...note, ...data } : note
        ),
        isLoading: false
      }))
    } catch (error) {
      console.error('Error updating note:', error)
      set({ error: 'Failed to update note', isLoading: false })
    }
  },

  // Delete a note
  deleteNote: async (id) => {
    set({ isLoading: true, error: null })
    try {
      // Get the note to find its image URL
      const note = get().notes.find(n => n.id === id)
      if (note) {
        // Extract filename from URL for deletion
        const fileName = note.imageUrl.split('/').pop()
        if (fileName) {
          // Delete from storage
          await supabase.storage
            .from('handwritten-notes')
            .remove([fileName])
        }

        // Update set note count if note was in a set
        if (note.setId) {
          const currentSet = get().sets.find(s => s.id === note.setId)
          if (currentSet) {
            await supabase
              .from('handwritten_note_sets')
              .update({ noteCount: Math.max(0, currentSet.noteCount - 1) })
              .eq('id', note.setId)
          }
        }
      }

      // Delete from database
      const { error } = await supabase
        .from('handwritten_notes')
        .delete()
        .eq('id', id)

      if (error) throw error

      set(state => ({
        notes: state.notes.filter(note => note.id !== id),
        isLoading: false
      }))
    } catch (error) {
      console.error('Error deleting note:', error)
      set({ error: 'Failed to delete note', isLoading: false })
    }
  },

  // Fetch all sets
  fetchSets: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('handwritten_note_sets')
        .select('*')
        .order('createdAt', { ascending: false })

      if (error) throw error

      set({ sets: data || [], isLoading: false })
    } catch (error) {
      console.error('Error fetching sets:', error)
      set({ error: 'Failed to fetch sets', isLoading: false })
    }
  },

  // Create a new set
  createSet: async (setData) => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('handwritten_note_sets')
        .insert({
          name: setData.name,
          description: setData.description,
          noteCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      set(state => ({
        sets: [data, ...state.sets],
        isLoading: false
      }))
    } catch (error) {
      console.error('Error creating set:', error)
      set({ error: 'Failed to create set', isLoading: false })
    }
  },

  // Update a set
  updateSet: async (id, updates) => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('handwritten_note_sets')
        .update({
          ...updates,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      set(state => ({
        sets: state.sets.map(set => 
          set.id === id ? { ...set, ...data } : set
        ),
        isLoading: false
      }))
    } catch (error) {
      console.error('Error updating set:', error)
      set({ error: 'Failed to update set', isLoading: false })
    }
  },

  // Delete a set
  deleteSet: async (id) => {
    set({ isLoading: true, error: null })
    try {
      // First, move all notes in this set to no set
      await supabase
        .from('handwritten_notes')
        .update({ setId: null })
        .eq('setId', id)

      // Then delete the set
      const { error } = await supabase
        .from('handwritten_note_sets')
        .delete()
        .eq('id', id)

      if (error) throw error

      set(state => ({
        sets: state.sets.filter(set => set.id !== id),
        notes: state.notes.map(note => 
          note.setId === id ? { ...note, setId: null } : note
        ),
        isLoading: false
      }))
    } catch (error) {
      console.error('Error deleting set:', error)
      set({ error: 'Failed to delete set', isLoading: false })
    }
  },

  // Clear error
  clearError: () => set({ error: null })
}))
