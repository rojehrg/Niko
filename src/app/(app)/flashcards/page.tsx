"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Plus, Play, Trash2, Edit, FolderOpen, Settings, Shuffle } from "lucide-react";
import Link from "next/link";
import { useFlashcardStore } from "@/lib/stores/flashcard-store";
import { Button } from "@/components/ui/button";
import { InteractiveCard } from "@/components/flashcards/interactive-card";
import { useSearchParams } from "next/navigation";

export default function FlashcardsPage() {
  const searchParams = useSearchParams();
  const selectedSetId = searchParams.get('set');
  
  const { 
    flashcards, 
    sets, 
    removeFlashcard, 
    getFlashcardsBySet, 
    getDefaultSet 
  } = useFlashcardStore();
  
  const [filteredCards, setFilteredCards] = useState(flashcards);
  const [selectedSet, setSelectedSet] = useState(selectedSetId || 'all');

  useEffect(() => {
    if (selectedSet === 'all') {
      setFilteredCards(flashcards);
    } else {
      setFilteredCards(getFlashcardsBySet(selectedSet));
    }
  }, [selectedSet, flashcards, getFlashcardsBySet]);

  const handleSetChange = (setId: string) => {
    setSelectedSet(setId);
    // Update URL without page reload
    const url = setId === 'all' ? '/flashcards' : `/flashcards?set=${setId}`;
    window.history.pushState({}, '', url);
  };

  const currentSet = sets.find(set => set.id === selectedSet) || getDefaultSet();
  
  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">Flashcards</h1>
          <p className="text-sm text-[var(--foreground-secondary)]">
            {selectedSet === 'all' 
              ? `${flashcards.length} total cards` 
              : `${filteredCards.length} cards in ${currentSet.name}`
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          {filteredCards.length > 0 && (
            <div className="flex gap-2">
              <Link href={`/flashcards/study${selectedSet !== 'all' ? `?set=${selectedSet}` : ''}`}>
                <Button variant="outline" className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--hover)]">
                  <Play className="mr-2 h-4 w-4" />
                  Study
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--hover)]"
                onClick={() => {
                  const shuffled = [...filteredCards].sort(() => Math.random() - 0.5);
                  // This will trigger a re-render and show shuffled cards
                  setFilteredCards(shuffled);
                }}
              >
                <Shuffle className="mr-2 h-4 w-4" />
                Shuffle
              </Button>
            </div>
          )}
          <Link href="/flashcards/create">
            <Button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-sm hover:shadow-md transition-all duration-200">
              <Plus className="mr-2 h-4 w-4" />
              Add Card
            </Button>
          </Link>
          <Link href="/flashcards/sets">
            <Button variant="outline" className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--hover)]">
              <Settings className="mr-2 h-4 w-4" />
              Manage Sets
            </Button>
          </Link>
        </div>
      </div>

      {/* Set Filter */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <FolderOpen className="h-4 w-4 text-[var(--foreground-secondary)]" />
          <span className="text-sm font-medium text-[var(--foreground)]">Filter by Set:</span>
        </div>
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
            All Sets ({flashcards.length})
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
              {set.name} ({getFlashcardsBySet(set.id).length})
            </Button>
          ))}
        </div>
      </div>

      {/* Current Set Info */}
      {selectedSet !== 'all' && (
        <Card className="bg-[var(--background)] border-[var(--border)] mb-8">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 ${currentSet.color} rounded-lg flex items-center justify-center`}>
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-[var(--foreground)]">{currentSet.name}</h3>
                {currentSet.description && (
                  <p className="text-sm text-[var(--foreground-secondary)]">{currentSet.description}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flashcards Grid */}
      <div className="space-y-4">
        {filteredCards.length === 0 ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center max-w-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--background)] border border-[var(--border)] rounded-lg mb-6">
                <BookOpen className="h-8 w-8 text-[var(--foreground-tertiary)]" />
              </div>
              <h3 className="text-xl font-medium text-[var(--foreground)] mb-2">
                {selectedSet === 'all' ? 'No flashcards yet' : `No cards in ${currentSet.name}`}
              </h3>
              <p className="text-[var(--foreground-secondary)] mb-6 text-sm">
                {selectedSet === 'all' 
                  ? 'Create your first flashcard to start studying'
                  : `Add some flashcards to the ${currentSet.name} set`
                }
              </p>
              <div className="flex gap-3 justify-center">
                <Link href="/flashcards/create">
                  <Button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    New flashcard
                  </Button>
                </Link>
                {selectedSet !== 'all' && (
                  <Button
                    variant="outline"
                    onClick={() => handleSetChange('all')}
                    className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--hover)]"
                  >
                    View All Sets
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCards.map((card) => (
              <InteractiveCard
                key={card.id}
                card={card}
                onDelete={removeFlashcard}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
