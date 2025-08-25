"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StickyNote, Plus, Search, Pin, Trash2 } from "lucide-react";
import { useNotesStore } from "@/lib/stores/notes-store";
import { NoteEditor } from "@/components/notes/note-editor";
import { NoteCard } from "@/components/notes/note-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Note } from "@/lib/stores/notes-store";


export default function NotesPage() {
  const { notes, deleteNote, updateNote, fetchNotes, isLoading } = useNotesStore();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title" | "pinned">("date");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [selectedNotes, setSelectedNotes] = useState<Set<string>>(new Set());
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  // Filter and sort notes
  const filteredNotes = notes
    .filter(note => 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      try {
        if (sortBy === "pinned") {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          const aDate = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
          const bDate = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
          return bDate.getTime() - aDate.getTime();
        }
        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }
        const aDate = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
        const bDate = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
        return bDate.getTime() - aDate.getTime();
      } catch (error) {
        console.error('Error sorting notes:', error);
        return 0;
      }
    });

  const pinnedNotes = filteredNotes.filter(note => note.isPinned);
  const regularNotes = filteredNotes.filter(note => !note.isPinned);

  // Fetch notes from Supabase on component mount
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleDelete = (id: string) => {
    setNoteToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (noteToDelete) {
      try {
        await deleteNote(noteToDelete);
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
      setNoteToDelete(null);
    }
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingNote(null);
  };

  // Multi-select functions
  const toggleMultiSelectMode = () => {
    setIsMultiSelectMode(!isMultiSelectMode);
    if (isMultiSelectMode) {
      setSelectedNotes(new Set());
    }
  };

  const toggleNoteSelection = (noteId: string) => {
    const newSelected = new Set(selectedNotes);
    if (newSelected.has(noteId)) {
      newSelected.delete(noteId);
    } else {
      newSelected.add(noteId);
    }
    setSelectedNotes(newSelected);
  };

  const selectAllNotes = () => {
    setSelectedNotes(new Set(filteredNotes.map(note => note.id)));
  };

  const clearSelection = () => {
    setSelectedNotes(new Set());
  };

  const handleBulkDelete = async () => {
    try {
      const deletePromises = Array.from(selectedNotes).map(id => deleteNote(id));
      await Promise.all(deletePromises);
      setSelectedNotes(new Set());
      setIsMultiSelectMode(false);
      setShowBulkDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete notes:', error);
    }
  };


  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      {/* Simple Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">Notes</h1>
          <p className="text-sm text-[var(--foreground-secondary)]">{notes.length} notes</p>
        </div>
        <Button
          onClick={() => setIsEditorOpen(true)}
          className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-sm hover:shadow-md transition-all duration-200"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      </div>

      {/* Simple Search and Sort */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--foreground-tertiary)]" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
          />
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "date" | "title" | "pinned")}
          className="px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#2e75cc]"
        >
          <option value="date">By Date</option>
          <option value="title">By Title</option>
          <option value="pinned">Pinned First</option>
        </select>
      </div>

      {/* Multi-select Controls */}
      {filteredNotes.length > 0 && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant={isMultiSelectMode ? "default" : "outline"}
              onClick={toggleMultiSelectMode}
              className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--hover)]"
            >
              {isMultiSelectMode ? "Cancel Selection" : "Select Multiple"}
            </Button>
            
            {isMultiSelectMode && (
              <>
                <Button
                  variant="outline"
                  onClick={selectAllNotes}
                  className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--hover)]"
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  onClick={clearSelection}
                  className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--hover)]"
                >
                  Clear Selection
                </Button>
                {selectedNotes.size > 0 && (
                  <Button
                    variant="destructive"
                    onClick={() => setShowBulkDeleteConfirm(true)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete {selectedNotes.size} Note{selectedNotes.size !== 1 ? 's' : ''}
                  </Button>
                )}
              </>
            )}
          </div>
          
          {isMultiSelectMode && selectedNotes.size > 0 && (
            <span className="text-sm text-[var(--foreground-secondary)]">
              {selectedNotes.size} note{selectedNotes.size !== 1 ? 's' : ''} selected
            </span>
          )}
        </div>
      )}

      {/* Notes Grid */}
      <div className="space-y-4">
        {isLoading ? (
          <Card className="bg-[var(--background)] border-[var(--border)] shadow-sm">
            <CardContent className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--hover)] rounded-full mb-6">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-[var(--foreground-tertiary)] border-t-transparent"></div>
              </div>
              <h3 className="text-2xl font-semibold text-[var(--foreground)] mb-2">Loading notes...</h3>
              <p className="text-[var(--foreground-secondary)]">Please wait while we fetch your notes</p>
            </CardContent>
          </Card>
        ) : filteredNotes.length === 0 ? (
          <Card className="bg-[var(--background)] border-[var(--border)] shadow-sm">
            <CardContent className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--hover)] rounded-full mb-6">
                <StickyNote className="h-10 w-10 text-[var(--foreground-secondary)]" />
              </div>
              <h3 className="text-2xl font-semibold text-[var(--foreground)] mb-2">
                {searchQuery ? "No notes found" : "No notes yet"}
              </h3>
              <p className="text-[var(--foreground-secondary)] mb-6 max-w-md mx-auto">
                {searchQuery
                  ? "Try adjusting your search terms or create a new note"
                  : ""
                }
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => setIsEditorOpen(true)}
                  size="lg"
                  className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create Your First Note
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Pinned Notes */}
            {pinnedNotes.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-medium text-[var(--foreground)] flex items-center gap-2">
                  <Pin className="h-4 w-4 text-orange-500" />
                  Pinned ({pinnedNotes.length})
                </h2>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {pinnedNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Notes */}
            {regularNotes.length > 0 && (
              <div className="space-y-3">
                {pinnedNotes.length > 0 && (
                  <h2 className="text-lg font-medium text-[var(--foreground)]">
                    All Notes ({regularNotes.length})
                  </h2>
                )}
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {regularNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Note Editor Popup */}
      <NoteEditor
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setNoteToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}
