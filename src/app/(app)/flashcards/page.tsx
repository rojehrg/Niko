"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Plus, Play, Search, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { useFlashcardStore } from "@/lib/stores/flashcard-store";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

export default function FlashcardsPage() {
  const searchParams = useSearchParams();
  const selectedSetId = searchParams.get('set');
  
  const { 
    flashcards, 
    sets, 
    fetchFlashcards,
    fetchSets
  } = useFlashcardStore();
  
  const [filteredCards, setFilteredCards] = useState(flashcards);
  const [selectedSet, setSelectedSet] = useState(selectedSetId || 'all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFlashcards();
    fetchSets();
  }, [fetchFlashcards, fetchSets]);

  useEffect(() => {
    let cards = selectedSet === 'all' ? flashcards : flashcards.filter(card => card.setId === selectedSet);
    
    if (searchTerm) {
      cards = cards.filter(card => 
        card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.back.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredCards(cards);
  }, [selectedSet, flashcards, searchTerm]);

  const handleSetChange = (setId: string) => {
    setSelectedSet(setId);
    const url = setId === 'all' ? '/flashcards' : `/flashcards?set=${setId}`;
    window.history.pushState({}, '', url);
  };

  const currentSet = sets.find(set => set.id === selectedSet);
  
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
  
  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[var(--foreground)] tracking-tight mb-2">
          Flashcards
        </h1>
        <p className="text-[var(--foreground-secondary)] text-lg">
          {filteredCards.length} card{filteredCards.length !== 1 ? 's' : ''} • {sets.length} set{sets.length !== 1 ? 's' : ''}
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
        <Link href="/flashcards/sets">
          <Button variant="outline" className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--hover)] px-6 py-3">
            <BookOpen className="mr-2 h-5 w-5" />
            Manage Sets
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--foreground-tertiary)] h-4 w-4" />
          <input
            type="text"
            placeholder="Search flashcards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200"
          />
        </div>
        
        {/* Set Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedSet === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSetChange('all')}
            className={selectedSet === 'all' 
              ? 'bg-[var(--primary)] text-white' 
              : 'border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--hover)]'
            }
          >
            All Sets
          </Button>
          {sets.map((set) => (
            <Button
              key={set.id}
              variant={selectedSet === set.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSetChange(set.id)}
              className={selectedSet === set.id 
                ? 'bg-[var(--primary)] text-white' 
                : 'border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--hover)]'
              }
            >
              <div className={`w-3 h-3 ${set.color} rounded-full mr-2`}></div>
              {set.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Study Session Button */}
      {filteredCards.length > 0 && (
        <div className="mb-8">
          <Link href={`/flashcards/study${selectedSet !== 'all' ? `?set=${selectedSet}` : ''}`}>
            <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3">
              <Play className="mr-2 h-5 w-5" />
              Start Study Session
            </Button>
          </Link>
        </div>
      )}

      {/* Content Display */}
      <div className="space-y-6">
        {selectedSet === 'all' ? (
          // Show Flashcard Sets when no specific set is selected
          <>
            {sets.length === 0 ? (
              <Card className="border-[var(--border)] bg-[var(--background)]">
                <CardContent className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--background-secondary)] border border-[var(--border)] rounded-full mb-6">
                    <BookOpen className="h-10 w-10 text-[var(--foreground-tertiary)]" />
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
                      onClick={() => handleSetChange(set.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 ${set.color} rounded-lg flex items-center justify-center`}>
                            <BookOpen className="h-6 w-6 text-white" />
                          </div>
                          <div className="text-xs text-[var(--foreground-tertiary)] bg-[var(--background-secondary)] px-2 py-1 rounded-full">
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
                            <span className="text-sm text-[var(--foreground-tertiary)]">
                              Created {formatDate(set.createdAt)}
                            </span>
                            <div className="text-[var(--foreground-secondary)] group-hover:text-[var(--primary)] transition-colors">
                              →
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          // Show individual flashcards when a specific set is selected
          <>
            {filteredCards.length === 0 ? (
              <Card className="border-[var(--border)] bg-[var(--background)]">
                <CardContent className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--background-secondary)] border border-[var(--border)] rounded-full mb-6">
                    <BookOpen className="h-10 w-10 text-[var(--foreground-tertiary)]" />
                  </div>
                  <h3 className="text-2xl font-semibold text-[var(--foreground)] mb-3">
                    {searchTerm 
                      ? 'No flashcards found' 
                      : `No cards in ${currentSet?.name || 'this set'}`
                    }
                  </h3>
                  <p className="text-[var(--foreground-secondary)] mb-6 text-lg">
                    {searchTerm 
                      ? 'Try adjusting your search'
                      : 'Create your first flashcard to start studying'
                    }
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Link href="/flashcards/create">
                      <Button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-6 py-3">
                        <Plus className="mr-2 h-5 w-5" />
                        Create Your First Flashcard
                      </Button>
                    </Link>
                    {searchTerm && (
                      <Button 
                        variant="outline" 
                        onClick={() => setSearchTerm('')}
                        className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--hover)] px-6 py-3"
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCards.map((card) => (
                  <Card 
                    key={card.id} 
                    className="border-[var(--border)] bg-[var(--background)] hover:shadow-lg transition-all duration-200 hover:scale-105 group cursor-pointer"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 ${sets.find(s => s.id === card.setId)?.color || 'bg-gray-400'} rounded-full`}></div>
                          <span className="text-sm text-[var(--foreground-secondary)]">
                            {sets.find(s => s.id === card.setId)?.name || 'Unknown Set'}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[var(--foreground-secondary)]">Question:</span>
                        </div>
                        <p className="text-[var(--foreground)] font-medium leading-relaxed">
                          {card.front}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[var(--foreground-secondary)]">Answer:</span>
                        </div>
                        <p className="text-[var(--foreground-secondary)] leading-relaxed line-clamp-3">
                          {card.back}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-[var(--foreground-tertiary)]">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(card.createdAt)}
                        </div>
                        {card.lastStudied && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatTimeAgo(card.lastStudied)}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
