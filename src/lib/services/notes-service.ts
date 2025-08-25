import { supabase } from '@/lib/supabase/client';
import { Note } from '@/lib/stores/notes-store';

export interface CreateNoteData {
  title: string;
  content: string;
  color: string;
  tags: string[];
  isPinned: boolean;
}

export type UpdateNoteData = Partial<CreateNoteData>

export class NotesService {
  static async getNotes(): Promise<Note[]> {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }

    return data?.map(note => ({
      id: note.id,
      title: note.title,
      content: note.content,
      color: note.color,
      tags: note.tags || [],
      isPinned: note.is_pinned,
      createdAt: new Date(note.created_at),
      updatedAt: new Date(note.updated_at),
    })) || [];
  }

  static async createNote(noteData: CreateNoteData): Promise<Note> {
    console.log('Attempting to create note:', noteData);
    
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
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      color: data.color,
      tags: data.tags || [],
      isPinned: data.is_pinned,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  static async updateNote(id: string, updates: UpdateNoteData): Promise<Note> {
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

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      color: data.color,
      tags: data.tags || [],
      isPinned: data.is_pinned,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  static async deleteNote(id: string): Promise<void> {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }

  static async togglePin(id: string, isPinned: boolean): Promise<Note> {
    const { data, error } = await supabase
      .from('notes')
      .update({ is_pinned: isPinned })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error toggling pin:', error);
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      color: data.color,
      tags: data.tags || [],
      isPinned: data.is_pinned,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
}
