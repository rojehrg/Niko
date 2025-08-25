"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Check, X, ChevronLeft, ChevronRight, Brain, Target, Sparkles, BookOpen, Shuffle, Timer, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useFlashcardStore } from "@/lib/stores/flashcard-store";
import { useSearchParams } from "next/navigation";

export default function StudyPage() {
  const searchParams = useSearchParams();
  const selectedSetId = searchParams.get('set');
  
  const { flashcards, sets, getFlashcardsBySet } = useFlashcardStore();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedCards, setStudiedCards] = useState<Set<string>>(new Set());
  const [correctCards, setCorrectCards] = useState<Set<string>>(new Set());
  const [incorrectCards, setIncorrectCards] = useState<Set<string>>(new Set());
  const [shuffledCards, setShuffledCards] = useState<typeof cardsToStudy>([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [studyStartTime, setStudyStartTime] = useState<Date | null>(null);
  const [showStats, setShowStats] = useState(false);

  // Get cards to study based on set filter
  const cardsToStudy = selectedSetId 
    ? getFlashcardsBySet(selectedSetId)
    : flashcards;

  const currentSet = selectedSetId ? sets.find(set => set.id === selectedSetId) : null;

  // Initialize shuffled cards and start timer
  useEffect(() => {
    setShuffledCards([...cardsToStudy]);
    if (!studyStartTime) {
      setStudyStartTime(new Date());
    }
  }, [cardsToStudy, studyStartTime]);

  // Get current cards (shuffled or original)
  const currentCards = isShuffled ? shuffledCards : cardsToStudy;

  if (currentCards.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--background-secondary)] p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/flashcards"
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--background)] border border-[var(--border)] hover:bg-[var(--hover)] transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 text-[var(--foreground-secondary)]" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-[var(--foreground)]">Study Mode</h1>
              <p className="text-[var(--foreground-secondary)]">
                Practice with your flashcards
              </p>
            </div>
          </div>

          <Card className="bg-[var(--background)] border-[var(--border)]">
            <CardContent className="text-center py-12">
              {currentSet ? (
                <>
                  <div className="flex items-center justify-center mb-6">
                    <div className={`w-16 h-16 ${currentSet.color} rounded-xl flex items-center justify-center mr-4`}>
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-semibold text-[var(--foreground)]">{currentSet.name}</h3>
                      {currentSet.description && (
                        <p className="text-[var(--foreground-secondary)]">{currentSet.description}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-[var(--foreground-secondary)] mb-6 text-lg">
                    No flashcards in the &quot;{currentSet.name}&quot; set yet.
                  </p>
                </>
              ) : (
                <p className="text-[var(--foreground-secondary)] mb-6 text-lg">
                  No flashcards to study yet.
                </p>
              )}
              <div className="flex gap-4 justify-center">
                <Link
                  href="/flashcards/create"
                  className="inline-flex items-center justify-center rounded-lg text-sm font-medium bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] h-11 px-6 py-2 transition-all duration-200"
                >
                  Create Your First Flashcard
                </Link>
                {currentSet && (
                  <Link
                    href="/flashcards"
                    className="inline-flex items-center justify-center rounded-lg text-sm font-medium border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--hover)] h-11 px-6 py-2 transition-all duration-200"
                  >
                    View All Sets
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentCard = currentCards[currentCardIndex];
  const isLastCard = currentCardIndex === currentCards.length - 1;
  const studyTime = studyStartTime ? Math.floor((Date.now() - studyStartTime.getTime()) / 1000) : 0;

  const handleNext = () => {
    if (currentCardIndex < currentCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleRestart = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setStudiedCards(new Set());
    setCorrectCards(new Set());
    setIncorrectCards(new Set());
    setStudyStartTime(new Date());
    setShowStats(false);
  };

  const handleShuffle = () => {
    const newShuffledCards = [...cardsToStudy].sort(() => Math.random() - 0.5);
    setShuffledCards(newShuffledCards);
    setIsShuffled(true);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setStudiedCards(new Set());
    setCorrectCards(new Set());
    setIncorrectCards(new Set());
    setStudyStartTime(new Date());
    setShowStats(false);
  };

  const markAsCorrect = () => {
    setCorrectCards(prev => new Set([...prev, currentCard.id]));
    setStudiedCards(prev => new Set([...prev, currentCard.id]));
  };

  const markAsIncorrect = () => {
    setIncorrectCards(prev => new Set([...prev, currentCard.id]));
    setStudiedCards(prev => new Set([...prev, currentCard.id]));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[var(--background-secondary)] p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/flashcards"
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--background)] border border-[var(--border)] hover:bg-[var(--hover)] transition-all duration-200 group"
            >
              <ArrowLeft className="h-4 w-4 text-[var(--foreground-secondary)] group-hover:text-[var(--foreground)]" />
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-[var(--foreground)]">Study Session</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-[var(--foreground-secondary)]">
                {currentSet && (
                  <span className="flex items-center gap-2">
                    <div className={`w-3 h-3 ${currentSet.color} rounded-full`}></div>
                    {currentSet.name}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Timer className="w-3 h-3" />
                  {formatTime(studyTime)}
                </span>
                <span className="flex items-center gap-1">
                  <BarChart3 className="w-3 h-3" />
                  {correctCards.size}/{studiedCards.size} correct
                </span>
                {isShuffled && (
                  <span className="text-[var(--accent-purple)] font-medium">• Shuffled</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={handleShuffle}
              className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--hover)]"
            >
              <Shuffle className="mr-2 h-4 w-4" />
              {isShuffled ? 'Shuffled' : 'Shuffle'}
            </Button>
            <Button
              variant="ghost"
              onClick={handleRestart}
              className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--hover)]"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Restart
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-[var(--foreground-secondary)] mb-3">
            <span>Study Progress</span>
            <span>{Math.round((studiedCards.size / currentCards.length) * 100)}% Complete</span>
          </div>
          <div className="w-full h-3 bg-[var(--border)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 transition-all duration-500 ease-out"
              style={{ width: `${(studiedCards.size / currentCards.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-[var(--foreground-tertiary)] mt-2">
            <span>Card {currentCardIndex + 1} of {currentCards.length}</span>
            <span>{currentCards.length - studiedCards.size} remaining</span>
          </div>
        </div>

        {/* Flashcard */}
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-3xl">
            <div className="aspect-[4/3] relative">
              <div 
                className="w-full h-full relative cursor-pointer group"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div className={`w-full h-full transition-all duration-700 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                  {/* Front */}
                  <div className={`absolute inset-0 w-full h-full backface-hidden ${isFlipped ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
                    <Card className="w-full h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                      <CardContent className="p-8 h-full flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm font-medium text-[var(--foreground-secondary)]">Question</span>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                          <p className="text-center text-[var(--foreground)] text-xl font-medium leading-relaxed max-w-2xl">
                            {currentCard.front}
                          </p>
                        </div>
                        <div className="text-center mt-4">
                          <p className="text-sm text-[var(--foreground-tertiary)] flex items-center justify-center gap-2">
                            <Brain className="w-4 h-4" />
                            Click to reveal answer
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Back */}
                  <div className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 ${isFlipped ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                    <Card className="w-full h-full bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                      <CardContent className="p-8 h-full flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium text-[var(--foreground-secondary)]">Answer</span>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                          <p className="text-center text-[var(--foreground)] text-xl font-medium leading-relaxed max-w-2xl">
                            {currentCard.back}
                          </p>
                        </div>
                        <div className="text-center mt-4">
                          <p className="text-sm text-[var(--foreground-tertiary)] flex items-center justify-center gap-2">
                            <Target className="w-4 h-4" />
                            How did you do?
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isFlipped && (
          <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  markAsIncorrect();
                  setTimeout(() => handleNext(), 500);
                }}
                className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20 h-12 px-6 transition-all duration-200"
                disabled={studiedCards.has(currentCard.id)}
              >
                <X className="mr-2 h-5 w-5" />
                Need Review
              </Button>
              <Button
                onClick={() => {
                  markAsCorrect();
                  setTimeout(() => handleNext(), 500);
                }}
                className="bg-green-600 hover:bg-green-700 text-white h-12 px-6 transition-all duration-200"
                disabled={studiedCards.has(currentCard.id)}
              >
                <Check className="mr-2 h-5 w-5" />
                Got It!
              </Button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentCardIndex === 0}
            className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--hover)] h-11 px-4 transition-all duration-200"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <div className="text-center">
            <div className="text-sm text-[var(--foreground-secondary)] mb-2">
              {studiedCards.size} of {currentCards.length} cards studied
            </div>
            <div className="flex items-center gap-6 text-xs">
              <span className="flex items-center gap-2 text-green-600">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                {correctCards.size} correct
              </span>
              <span className="flex items-center gap-2 text-red-600">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                {incorrectCards.size} to review
              </span>
            </div>
          </div>
          
          <Button
            onClick={handleNext}
            disabled={isLastCard}
            className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white h-11 px-4 transition-all duration-200"
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Completion Message */}
        {isLastCard && studiedCards.has(currentCard.id) && (
          <div className="text-center">
            <Card className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-950/20 dark:via-blue-950/20 dark:to-purple-950/20 border-green-200 dark:border-green-800 max-w-2xl mx-auto">
              <CardContent className="py-12">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                    <Sparkles className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[var(--foreground)] mb-3">
                  Study Session Complete! 🎉
                </h3>
                <p className="text-[var(--foreground-secondary)] mb-6 text-lg">
                  Great work! You studied for {formatTime(studyTime)} and mastered {correctCards.size} out of {currentCards.length} cards.
                </p>
                
                {!showStats && (
                  <Button
                    onClick={() => setShowStats(true)}
                    className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white mb-4"
                  >
                    View Detailed Stats
                  </Button>
                )}
                
                {showStats && (
                  <div className="bg-[var(--background)] rounded-lg p-4 mb-6 border border-[var(--border)]">
                    <h4 className="font-semibold text-[var(--foreground)] mb-3">Session Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{correctCards.size}</div>
                        <div className="text-[var(--foreground-secondary)]">Correct</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{incorrectCards.size}</div>
                        <div className="text-[var(--foreground-secondary)]">Need Review</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{Math.round((correctCards.size / currentCards.length) * 100)}%</div>
                        <div className="text-[var(--foreground-secondary)]">Success Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{formatTime(studyTime)}</div>
                        <div className="text-[var(--foreground-secondary)]">Study Time</div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-center gap-4">
                  <Button
                    onClick={handleRestart}
                    variant="outline"
                    className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--hover)] h-11 px-6"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Study Again
                  </Button>
                  <Link href="/flashcards">
                    <Button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white h-11 px-6">
                      Back to Flashcards
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
