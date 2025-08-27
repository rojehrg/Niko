"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Save, Palette, Pin, Tag, Calendar } from "lucide-react";
import { useNotesStore, Note } from "@/lib/stores/notes-store";

interface NoteEditorProps {
  isOpen: boolean;
  onClose: () => void;
  editingNote?: Note | null;
}

const NOTE_COLORS = [
  { 
    name: "Pearl", 
    value: "bg-gray-25 dark:bg-gray-700/40", 
    accent: "bg-gray-100 dark:bg-gray-600",
    text: "text-gray-700 dark:text-gray-100",
    icon: "text-gray-500 dark:text-gray-300"
  },
  { 
    name: "Lavender", 
    value: "bg-purple-25 dark:bg-purple-600/40", 
    accent: "bg-purple-100 dark:bg-purple-500",
    text: "text-purple-800 dark:text-purple-100",
    icon: "text-purple-600 dark:text-purple-300"
  },
  { 
    name: "Mint", 
    value: "bg-emerald-25 dark:bg-emerald-600/40", 
    accent: "bg-emerald-100 dark:bg-emerald-500",
    text: "text-emerald-800 dark:text-emerald-100",
    icon: "text-emerald-600 dark:text-emerald-300"
  },
  { 
    name: "Peach", 
    value: "bg-orange-25 dark:bg-orange-600/40", 
    accent: "bg-orange-100 dark:bg-orange-500",
    text: "text-orange-800 dark:text-orange-100",
    icon: "text-orange-600 dark:text-orange-300"
  },
  { 
    name: "Sky", 
    value: "bg-blue-25 dark:bg-blue-600/40", 
    accent: "bg-blue-100 dark:bg-blue-500",
    text: "text-blue-800 dark:text-blue-100",
    icon: "text-blue-600 dark:text-blue-300"
  },
  { 
    name: "Rose", 
    value: "bg-pink-25 dark:bg-pink-600/40", 
    accent: "bg-pink-100 dark:bg-pink-500",
    text: "text-pink-800 dark:text-pink-100",
    icon: "text-pink-600 dark:text-pink-300"
  },
  { 
    name: "Sage", 
    value: "bg-teal-25 dark:bg-teal-600/40", 
    accent: "bg-teal-100 dark:bg-teal-500",
    text: "text-teal-800 dark:text-teal-100",
    icon: "text-teal-600 dark:text-teal-300"
  },
  { 
    name: "Coral", 
    value: "bg-red-25 dark:bg-red-600/40", 
    accent: "bg-red-100 dark:bg-red-500",
    text: "text-red-800 dark:text-red-100",
    icon: "text-red-600 dark:text-red-300"
  },
  { 
    name: "Lilac", 
    value: "bg-violet-25 dark:bg-violet-600/40", 
    accent: "bg-violet-100 dark:bg-violet-500",
    text: "text-violet-800 dark:text-violet-100",
    icon: "text-violet-600 dark:text-violet-300"
  },
  { 
    name: "Honey", 
    value: "bg-amber-25 dark:bg-amber-600/40", 
    accent: "bg-amber-100 dark:bg-amber-500",
    text: "text-amber-800 dark:text-amber-100",
    icon: "text-amber-600 dark:text-amber-300"
  },
  { 
    name: "Seafoam", 
    value: "bg-cyan-25 dark:bg-cyan-600/40", 
    accent: "bg-cyan-100 dark:bg-cyan-500",
    text: "text-cyan-800 dark:text-cyan-100",
    icon: "text-cyan-600 dark:text-cyan-300"
  },
  { 
    name: "Blush", 
    value: "bg-rose-25 dark:bg-rose-600/40", 
    accent: "bg-rose-100 dark:bg-rose-500",
    text: "text-rose-800 dark:text-rose-100",
    icon: "text-rose-600 dark:text-rose-300"
  }
];

export function NoteEditor({ isOpen, onClose, editingNote }: NoteEditorProps) {
  const addNote = useNotesStore((state) => state.addNote);
  const updateNote = useNotesStore((state) => state.updateNote);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0]);
  const [tags, setTags] = useState<string[]>([]);
  const [isPinned, setIsPinned] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Populate form when editing a note
  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
      setSelectedColor(NOTE_COLORS.find(color => color.value === editingNote.color) || NOTE_COLORS[0]);
      setTags(editingNote.tags);
      setIsPinned(editingNote.isPinned);
    } else {
      // Reset form for new note
      setTitle("");
      setContent("");
      setSelectedColor(NOTE_COLORS[0]);
      setTags([]);
      setIsPinned(false);
    }
  }, [editingNote]);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate save delay for animation
    await new Promise(resolve => setTimeout(resolve, 800));

    if (editingNote) {
      // Update existing note
      await updateNote(editingNote.id, {
        title: title.trim() || "Untitled Note",
        content: content.trim() || "No content",
        color: selectedColor.value,
        tags,
        isPinned,
      });
    } else {
      // Create new note
      await addNote({
        title: title.trim() || "Untitled Note",
        content: content.trim() || "No content",
        color: selectedColor.value,
        tags,
        isPinned,
      });
    }
    
    setIsSaving(false);
    onClose();
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className={`w-full max-w-3xl max-h-[85vh] overflow-hidden bg-[var(--background)] border border-[var(--border)] rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300`}>
        
        {/* Color Selection Bar */}
        <div className={`h-1 ${selectedColor.accent} transition-colors duration-300`}></div>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              {editingNote ? 'Edit Note' : 'Create Note'}
            </h2>
            {/* Color Picker */}
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className={`p-2 rounded-lg hover:bg-[var(--hover)] transition-all duration-200 ${selectedColor.icon} hover:scale-105 group`}
                title="Choose color"
              >
                <Palette className="h-5 w-5 group-hover:rotate-12 transition-transform duration-200" />
              </button>
              
              {showColorPicker && (
                <div className="absolute top-12 left-0 bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-xl p-4 z-10 min-w-[280px] animate-in slide-in-from-top-2 duration-200">
                  <h4 className="text-sm font-medium text-[var(--foreground)] mb-3">Color Palette</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {NOTE_COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => {
                          setSelectedColor(color);
                          setShowColorPicker(false);
                        }}
                        className={`group relative h-8 w-8 rounded-lg transition-all duration-200 ${
                          selectedColor.value === color.value 
                            ? 'ring-2 ring-[var(--primary)] scale-110' 
                            : 'hover:scale-105'
                        } ${color.value} border border-[var(--border)]`}
                        title={color.name}
                      >
                        {selectedColor.value === color.value && (
                          <div className="absolute inset-0 rounded-lg flex items-center justify-center">
                            <div className="w-2 h-2 bg-[var(--foreground)] rounded-full opacity-60"></div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Pin Toggle */}
            <button
              onClick={() => setIsPinned(!isPinned)}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                isPinned 
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30' 
                  : `${selectedColor.icon} hover:bg-[var(--hover)]`
              }`}
              title={isPinned ? "Unpin note" : "Pin note"}
            >
              <Pin className={`h-5 w-5 transition-transform duration-200 ${isPinned ? 'fill-current rotate-12' : 'hover:rotate-12'}`} />
            </button>
            
            {/* Tags Toggle */}
            <button
              onClick={() => setShowTags(!showTags)}
              className={`p-2 rounded-lg hover:bg-[var(--hover)] transition-all duration-200 ${selectedColor.icon} hover:scale-105 group`}
              title="Add tags"
            >
              <Tag className="h-5 w-5 group-hover:rotate-12 transition-transform duration-200" />
            </button>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--hover)] transition-all duration-200 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:scale-105 hover:rotate-90 group"
            title="Close editor"
          >
            <X className="h-5 w-5 transition-transform duration-200" />
          </button>
        </div>
        
        {/* Tags Section */}
        {showTags && (
          <div className="p-4 border-b border-[var(--border)] bg-[var(--background-secondary)] animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-xs rounded-full hover:bg-[var(--primary)]/20 transition-colors duration-200 group cursor-pointer"
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag}
                  <X className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                className="flex-1 text-sm bg-[var(--background)] border-[var(--border)] focus:border-[var(--primary)] text-[var(--foreground)]"
              />
              <Button 
                onClick={handleAddTag}
                size="sm"
                className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white"
              >
                Add
              </Button>
            </div>
          </div>
        )}
        
        {/* Content Area */}
        <div className={`flex-1 overflow-y-auto ${selectedColor.value}`}>
          <div className="p-6 space-y-4">
            {/* Title Input */}
            <Input
              ref={titleRef}
              placeholder="Untitled note"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`text-2xl font-semibold border-0 bg-transparent p-0 focus-visible:ring-0 ${selectedColor.text} placeholder:opacity-50 w-full`}
              onKeyDown={handleKeyDown}
            />
            
            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent"></div>
            
            {/* Content Input */}
            <Textarea
              ref={contentRef}
              placeholder="Start writing your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`min-h-[350px] border-0 bg-transparent p-0 resize-none focus-visible:ring-0 text-base leading-relaxed ${selectedColor.text} placeholder:opacity-50`}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-[var(--border)] bg-[var(--background)]">
          <div className="flex items-center gap-2 text-xs text-[var(--foreground-secondary)]">
            <Calendar className="h-4 w-4" />
            <span>Ctrl+Enter to save</span>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--hover)] transition-all duration-200 px-6 group relative overflow-hidden"
            >
              <span className="font-medium">Cancel</span>
            </Button>
            
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white transition-all duration-300 px-6 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group shadow-lg hover:shadow-xl"
            >
              {isSaving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span className="animate-pulse">Saving...</span>
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">{editingNote ? 'Update Note' : 'Save Note'}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}