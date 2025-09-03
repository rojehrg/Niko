'use client'

import { useState, useEffect } from 'react'
import { Plus, Upload, Grid, List, Search, Filter, Folder, Tag, Calendar, Star, Trash2, Edit3, Eye } from 'lucide-react'
import { useHandwrittenNotesStore } from '@/lib/stores/handwritten-notes-store'

export default function HandwrittenNotesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSet, setSelectedSet] = useState<string>('all')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isCreateSetModalOpen, setIsCreateSetModalOpen] = useState(false)
  const [selectedNotes, setSelectedNotes] = useState<string[]>([])
  const [isSelectionMode, setIsSelectionMode] = useState(false)

  const {
    notes,
    sets,
    fetchNotes,
    fetchSets,
    createSet,
    addNote,
    deleteNote,
    updateNote,
    deleteSet
  } = useHandwrittenNotesStore()

  useEffect(() => {
    fetchNotes()
    fetchSets()
  }, [fetchNotes, fetchSets])

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesSet = selectedSet === 'all' || note.setId === selectedSet
    return matchesSearch && matchesSet
  })

  const handleFileUpload = async (files: FileList) => {
    const uploadedFiles = Array.from(files)
    for (const file of uploadedFiles) {
      if (file.type.startsWith('image/')) {
        const noteData = {
          title: file.name.replace(/\.[^/.]+$/, ''),
          description: '',
          tags: [],
          setId: selectedSet === 'all' ? null : selectedSet,
          imageUrl: URL.createObjectURL(file), // Temporary URL for preview
          file: file
        }
        await addNote(noteData)
      }
    }
    setIsUploadModalOpen(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }

  const toggleNoteSelection = (noteId: string) => {
    setSelectedNotes(prev => 
      prev.includes(noteId) 
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    )
  }

  const handleBulkDelete = async () => {
    for (const noteId of selectedNotes) {
      await deleteNote(noteId)
    }
    setSelectedNotes([])
    setIsSelectionMode(false)
  }

  const handleBulkMoveToSet = async (setId: string) => {
    for (const noteId of selectedNotes) {
      await updateNote(noteId, { setId })
    }
    setSelectedNotes([])
    setIsSelectionMode(false)
  }

  return (
    <div className="min-h-screen py-8">
      {/* Header */}
      <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Handwritten Notes</h1>
              <p className="text-[var(--foreground-secondary)] text-sm">
                Upload, organize, and access your handwritten notes from anywhere
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCreateSetModalOpen(true)}
                className="bg-[var(--background-secondary)] hover:bg-[var(--hover)] text-[var(--foreground)] border border-[var(--border)] px-4 py-2 h-10 rounded-md transition-all duration-150 flex items-center gap-2 text-sm font-medium"
              >
                <Folder className="w-4 h-4" />
                New Set
              </button>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-[var(--background-secondary)] hover:bg-[var(--hover)] text-[var(--foreground)] border border-[var(--border)] px-4 py-2 h-10 rounded-md transition-all duration-150 flex items-center gap-2 text-sm font-medium"
              >
                <Upload className="w-4 h-4" />
                Upload Notes
              </button>
            </div>
          </div>
        </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Controls Bar */}
        <div className="bg-[var(--background-secondary)] rounded-md border border-[var(--border)] p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search and Filters */}
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--foreground-tertiary)] w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search notes, tags, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg pl-10 pr-4 py-2 text-[var(--foreground)] placeholder-[var(--foreground-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
              
              <select
                value={selectedSet}
                onChange={(e) => setSelectedSet(e.target.value)}
                className="bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="all">All Sets</option>
                {sets.map(set => (
                  <option key={set.id} value={set.id}>{set.name}</option>
                ))}
              </select>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              {isSelectionMode && (
                <div className="flex items-center gap-2 mr-4">
                  <span className="text-sm text-[var(--foreground-secondary)]">
                    {selectedNotes.length} selected
                  </span>
                  <button
                    onClick={handleBulkDelete}
                    className="bg-red-1000 hover:bg-red-600 text-white px-3 py-2 h-8 rounded text-sm transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                  <select
                    onChange={(e) => handleBulkMoveToSet(e.target.value)}
                    className="bg-[var(--background)] border border-[var(--border)] rounded px-2 py-1 text-sm focus:outline-none"
                  >
                    <option value="">Move to set...</option>
                    {sets.map(set => (
                      <option key={set.id} value={set.id}>{set.name}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <button
                onClick={() => setIsSelectionMode(!isSelectionMode)}
                className={`p-2 rounded-lg transition-colors ${
                  isSelectionMode 
                    ? 'bg-[var(--primary)] text-white' 
                    : 'bg-[var(--hover)] text-[var(--foreground)] hover:bg-[var(--active)]'
                }`}
                title="Selection Mode"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              
              <div className="bg-[var(--hover)] rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-[var(--active)] text-[var(--foreground)]' 
                      : 'text-[var(--foreground-tertiary)] hover:text-[var(--foreground)]'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-[var(--active)] text-[var(--foreground)]' 
                      : 'text-[var(--foreground-tertiary)] hover:text-[var(--foreground)]'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center mb-6 hover:border-[var(--primary)] transition-colors cursor-pointer"
          onClick={() => setIsUploadModalOpen(true)}
        >
          <Upload className="w-12 h-12 text-[var(--foreground-tertiary)] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
            Drop your handwritten notes here
          </h3>
          <p className="text-[var(--foreground-secondary)] mb-4">
            Or click to browse files. Supports JPG, PNG, and HEIC formats.
          </p>
          <button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-6 py-3 h-12 rounded-lg transition-colors">
            Choose Files
          </button>
        </div>

        {/* Notes Gallery */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
              No notes yet
            </h3>
            <p className="text-[var(--foreground-secondary)] mb-6">
              Start by uploading your first handwritten note
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-6 py-3 rounded-lg transition-colors"
            >
              Upload Your First Note
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {filteredNotes.map(note => (
              <div
                key={note.id}
                className={`bg-[var(--background-secondary)] rounded-xl border border-[var(--border)] overflow-hidden hover:shadow-lg transition-all duration-200 ${
                  isSelectionMode && selectedNotes.includes(note.id) ? 'ring-2 ring-[var(--primary)]' : ''
                }`}
              >
                {isSelectionMode && (
                  <div className="p-3 border-b border-[var(--border)]">
                    <input
                      type="checkbox"
                      checked={selectedNotes.includes(note.id)}
                      onChange={() => toggleNoteSelection(note.id)}
                      className="w-4 h-4 text-[var(--primary)] rounded border-[var(--border)] focus:ring-[var(--primary)]"
                    />
                  </div>
                )}
                
                <div className="relative group">
                  <img
                    src={note.imageUrl}
                    alt={note.title}
                    className={`w-full object-cover transition-transform duration-200 group-hover:scale-105 ${
                      viewMode === 'grid' ? 'h-48' : 'h-32'
                    }`}
                  />
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                    <button className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteNote(note.id)}
                      className="bg-red-1000/80 hover:bg-red-600/80 text-white p-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-[var(--foreground)] line-clamp-2">
                      {note.title}
                    </h3>
                    <button className="text-[var(--foreground-tertiary)] hover:text-[var(--foreground)] transition-colors">
                      <Star className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {note.description && (
                    <p className="text-[var(--foreground-secondary)] text-sm mb-3 line-clamp-2">
                      {note.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-[var(--foreground-tertiary)]">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(note.createdAt).toLocaleDateString()}
                    </div>
                    {note.setId && (
                      <div className="flex items-center gap-1">
                        <Folder className="w-3 h-3" />
                        {sets.find(s => s.id === note.setId)?.name}
                      </div>
                    )}
                  </div>
                  
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {note.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-[var(--hover)] text-[var(--foreground-secondary)] px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {note.tags.length > 3 && (
                        <span className="text-[var(--foreground-tertiary)] text-xs px-2 py-1">
                          +{note.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--background)] rounded-2xl shadow-2xl border border-[var(--border)] w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-4">
                Upload Handwritten Notes
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Select Files
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    className="w-full bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
                
                <div className="text-sm text-[var(--foreground-secondary)]">
                  <p>• Supported formats: JPG, PNG, HEIC</p>
                  <p>• Maximum file size: 10MB per image</p>
                  <p>• Images will be optimized for web viewing</p>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                                  <button
                    onClick={() => setIsUploadModalOpen(false)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 h-12 rounded-lg transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-3 h-12 rounded-lg transition-colors"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Set Modal */}
      {isCreateSetModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--background)] rounded-2xl shadow-2xl border border-[var(--border)] w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-4">
                Create New Set
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Set Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Math Notes, Biology Class"
                    className="w-full bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    placeholder="Describe what this set contains..."
                    rows={3}
                    className="w-full bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                                  <button
                    onClick={() => setIsCreateSetModalOpen(false)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 h-12 rounded-lg transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                <button
                  onClick={() => setIsCreateSetModalOpen(false)}
                  className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-3 h-12 rounded-lg transition-colors"
                >
                  Create Set
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
