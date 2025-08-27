"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Plus, Calendar, Clock, Trash2, Eye, Brain, Edit } from "lucide-react";
import Link from "next/link";
import { useFlashcardStore } from "@/lib/stores/flashcard-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function FlashcardsPage() {
  const { 
    flashcards, 
    sets, 
    fetchFlashcards,
    fetchSets,
    removeFlashcard,
    isLoading
  } = useFlashcardStore();
  

  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedSetForPreview, setSelectedSetForPreview] = useState<string | null>(null);
  const [showCreateSetModal, setShowCreateSetModal] = useState(false);
  const [newSetData, setNewSetData] = useState({
    name: '',
    description: '',
    color: 'bg-blue-500'
  });

  useEffect(() => {
    fetchFlashcards();
    fetchSets();
  }, [fetchFlashcards, fetchSets]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(date);
  };

  const confirmDelete = async () => {
    if (cardToDelete) {
      await removeFlashcard(cardToDelete);
      setShowDeleteModal(false);
      setCardToDelete(null);
    }
  };

  const handleCreateSet = async () => {
    if (newSetData.name.trim()) {
      await useFlashcardStore.getState().addSet(newSetData.name, newSetData.description, newSetData.color);
      setShowCreateSetModal(false);
      setNewSetData({ name: '', description: '', color: 'bg-blue-500' });
      fetchSets();
    }
  };

  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500', 'bg-pink-500', 'bg-indigo-500', 'bg-yellow-500'];
  
  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[var(--foreground)] tracking-tight mb-2">
          Flashcards
        </h1>
        <p className="text-[var(--foreground-secondary)] text-lg">
          {isLoading ? 'Loading...' : `${sets.length} set${sets.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Link href="/flashcards/create">
          <Button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-6 py-3">
            <Plus className="mr-2 h-5 w-5" />
            Create Flashcard
          </Button>
        </Link>
        <Link href="/flashcards/study">
          <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3">
            <img src="/sprites/notes.png" alt="Study" className="mr-2 h-5 w-5" />
            Study Mode
          </Button>
        </Link>
        <Link href="/flashcards/sets">
          <Button variant="outline" className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--hover)] px-6 py-3">
            <BookOpen className="mr-2 h-5 w-5" />
            Manage Sets
          </Button>
        </Link>
      </div>

      {/* Content Display */}
      <div className="space-y-6">
        {isLoading ? (
          <Card className="border-[var(--border)] bg-[var(--background)]">
            <CardContent className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--background-secondary)] border border-[var(--border)] rounded-full mb-6">
                <div className="w-10 h-10 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin"></div>
              </div>
              <h3 className="text-2xl font-semibold text-[var(--foreground)] mb-3">
                Loading flashcards...
              </h3>
              <p className="text-[var(--foreground-secondary)] text-lg">
                Please wait while we fetch your flashcard sets
              </p>
            </CardContent>
          </Card>
        ) : sets.length === 0 ? (
          <Card className="border-[var(--border)] bg-[var(--background)]">
            <CardContent className="text-center py-16">
              <div className="inline-flex items-center justify-center mb-6">
                <img src="/sprites/flashcards.png" alt="Flashcards" className="h-16 w-16" />
              </div>
              <h3 className="text-2xl font-semibold text-[var(--foreground)] mb-3">
                No flashcard sets yet
              </h3>
              <p className="text-[var(--foreground-secondary)] mb-6 text-lg">
                Create your first set to start organizing flashcards
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/flashcards/sets">
                                      <Button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-6 py-3">
                    <Plus className="mr-2 h-5 w-5" />
                    Create First Set
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sets.map((set) => {
                  const cardCount = flashcards.filter(card => card.setId === set.id).length;
              return (
                <Card 
                  key={set.id} 
                  className="border-[var(--border)] bg-[var(--background)] hover:shadow-lg transition-all duration-200 hover:scale-105 group cursor-pointer"
                  onClick={() => {
                    const url = `/flashcards?set=${set.id}`;
                    window.history.pushState({}, '', url);
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 ${set.color} rounded-lg flex items-center justify-center`}>
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-xs text-[var(--foreground-secondary)] bg-[var(--background-secondary)] px-2 py-1 rounded-full">
                        {cardCount} card{cardCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                        {set.name}
                      </h3>
                      {set.description && (
                        <p className="text-sm text-[var(--foreground-secondary)] line-clamp-2">
                          {set.description}
                        </p>
                      )}
                                              <div className="flex items-center justify-between pt-2">
                          <span className="text-sm text-[var(--foreground-secondary)]">
                            Created {formatDate(set.createdAt)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSetForPreview(set.id);
                              setShowPreviewModal(true);
                            }}
                            className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--hover)]"
                          >
                            Preview
                          </Button>
                        </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <Card className="bg-[var(--background)] border-[var(--border)] shadow-2xl max-w-md w-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-500" />
                Delete Flashcard
              </CardTitle>
              <p className="text-[var(--foreground-secondary)]">
                Are you sure you want to delete this flashcard? This action cannot be undone.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3 pt-2">
                                  <Button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setCardToDelete(null);
                    }}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-[var(--foreground)] py-2.5 px-4 rounded-lg transition-all duration-200 font-medium dark:bg-red-900/30 dark:hover:bg-red-800/40"
                  >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && selectedSetForPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <Card className="bg-[var(--background)] border-[var(--border)] shadow-2xl max-w-4xl w-full max-h-[90vh]">
            <CardHeader className="pb-4 border-b border-[var(--border)]">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-3">
                    <div className={`w-8 h-8 ${sets.find(s => s.id === selectedSetForPreview)?.color || 'bg-gray-400'} rounded-lg flex items-center justify-center`}>
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    {sets.find(s => s.id === selectedSetForPreview)?.name || 'Unknown Set'}
                  </CardTitle>
                  <p className="text-[var(--foreground-secondary)] mt-2">
                    Preview all flashcards in this set
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowPreviewModal(false);
                    setSelectedSetForPreview(null);
                  }}
                  className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4">
                {flashcards
                  .filter(card => card.setId === selectedSetForPreview)
                  .map((card, index) => (
                    <div 
                      key={card.id} 
                      className="border border-[var(--border)] rounded-lg p-4 bg-[var(--background-secondary)] hover:bg-[var(--hover)] transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-sm font-medium text-[var(--foreground-secondary)] bg-[var(--background)] px-2 py-1 rounded">
                          Card {index + 1}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCardToDelete(card.id);
                            setShowDeleteModal(true);
                            setShowPreviewModal(false);
                          }}
                          className="text-red-500 hover:text-red-600 hover:bg-red-200 dark:hover:bg-red-950/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Question Side */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
                            <div className="w-2 h-2 bg-[var(--primary)] rounded-full"></div>
                            Question
                          </h4>
                          {card.questionImage && card.questionImage !== "placeholder_url" && !card.questionImage.endsWith('.png') && !card.questionImage.endsWith('.jpg') && !card.questionImage.endsWith('.jpeg') && !card.questionImage.endsWith('.gif') && (
                            <div className="mb-2">
                              <img 
                                src={card.questionImage} 
                                alt="Question" 
                                className="w-full h-24 object-cover rounded border border-[var(--border)]"
                              />
                            </div>
                          )}
                          <p className="text-[var(--foreground)] text-sm leading-relaxed">
                            {card.front}
                          </p>
                        </div>
                        
                        {/* Answer Side */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Answer
                          </h4>
                          {card.answerImage && card.answerImage !== "placeholder_url" && !card.answerImage.endsWith('.png') && !card.answerImage.endsWith('.jpg') && !card.answerImage.endsWith('.jpeg') && !card.answerImage.endsWith('.gif') && (
                            <div className="mb-2">
                              <img 
                                src={card.answerImage} 
                                alt="Answer" 
                                className="w-full h-24 object-cover rounded border border-[var(--border)]"
                              />
                            </div>
                          )}
                          <p className="text-[var(--foreground)] text-sm leading-relaxed">
                            {card.back}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
