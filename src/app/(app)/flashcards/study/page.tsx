"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Check, ChevronLeft, ChevronRight, Brain, Target, Sparkles, BookOpen, Shuffle, Timer, BarChart3, X } from "lucide-react";
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
  const [studyEndTime, setStudyEndTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [studySessionKey, setStudySessionKey] = useState(0);
  const [showStats, setShowStats] = useState(false);

  // Get cards to study based on set filter
  const cardsToStudy = useMemo(() => {
    return selectedSetId 
      ? getFlashcardsBySet(selectedSetId)
      : flashcards;
  }, [selectedSetId, flashcards, getFlashcardsBySet]);

  const currentSet = selectedSetId ? sets.find(set => set.id === selectedSetId) : null;

  // Initialize shuffled cards and start timer
  useEffect(() => {
    setShuffledCards([...cardsToStudy]);
    setIsFlipped(false); // Ensure card starts unflipped
    // Reset timer and study progress for new study session
    setStudyStartTime(new Date());
    setStudyEndTime(null);
    setCurrentTime(new Date());
    setCurrentCardIndex(0);
    setStudiedCards(new Set());
    setCorrectCards(new Set());
    setIncorrectCards(new Set());
  }, [cardsToStudy, studySessionKey]);

  // Get current cards (shuffled or original)
  const currentCards = isShuffled ? shuffledCards : cardsToStudy;

  const currentCard = currentCards[currentCardIndex];
  const isLastCard = currentCardIndex === currentCards.length - 1;
  const isStudyComplete = isLastCard && studiedCards.has(currentCard.id);
  
  // Set end time when study is complete
  useEffect(() => {
    if (isStudyComplete && !studyEndTime) {
      setStudyEndTime(new Date());
    }
  }, [isStudyComplete, studyEndTime]);

  // Timer that updates every second
  useEffect(() => {
    if (!studyStartTime || isStudyComplete) return;
    
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [studyStartTime, isStudyComplete]);

  // Ensure card is unflipped when card index changes
  useEffect(() => {
    setIsFlipped(false);
  }, [currentCardIndex]);
  
  const studyTime = studyStartTime ? Math.max(0, Math.floor(((studyEndTime || currentTime).getTime() - studyStartTime.getTime()) / 1000)) : 0;

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
    setStudySessionKey(prev => prev + 1); // Trigger new study session
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
    // Play correct sound
    if ((window as any).playCorrectSound) {
      (window as any).playCorrectSound();
    }
  };

  const markAsIncorrect = () => {
    setIncorrectCards(prev => new Set([...prev, currentCard.id]));
    setStudiedCards(prev => new Set([...prev, currentCard.id]));
    // Play wrong sound
    if ((window as any).playWrongSound) {
      (window as any).playWrongSound();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[var(--background-secondary)] p-6">
      <div className="max-w-5xl mx-auto relative">
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
              className="h-full bg-[var(--primary)] transition-all duration-500 ease-out"
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
          <div className="w-full max-w-md">
            <div className="aspect-[3/2] relative">
              <div 
                className="w-full h-full relative cursor-pointer group"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div className={`w-full h-full transition-all duration-700 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                  {/* Front */}
                  <div className={`absolute inset-0 w-full h-full backface-hidden ${isFlipped ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
                    <Card className="w-full h-full bg-white dark:bg-[var(--background-secondary)] border-2 border-[var(--border)] hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] shadow-lg">
                      <CardContent className="p-6 h-full flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-[var(--primary)] rounded-full"></div>
                            <span className="text-sm font-semibold text-[var(--foreground-secondary)] uppercase tracking-wide">Question</span>
                          </div>
                          <div className="text-xs text-[var(--foreground-tertiary)] bg-[var(--background)] px-2 py-1 rounded-full">
                            {currentCardIndex + 1} of {currentCards.length}
                          </div>
                        </div>
                        
                        {/* Question Content */}
                        <div className="flex-1 flex items-center justify-center text-center">
                          {currentCard.questionImage ? (
                            <div className="space-y-3">
                              <img 
                                src={currentCard.questionImage} 
                                alt="Question" 
                                className="max-w-full max-h-48 object-contain rounded-lg border border-[var(--border)]"
                              />
                              {currentCard.front && (
                                <p className="text-[var(--foreground)] text-2xl font-medium leading-relaxed max-w-lg">
                                  {currentCard.front}
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-[var(--foreground)] text-3xl font-medium leading-relaxed max-w-lg">
                              {currentCard.front}
                            </p>
                          )}
                        </div>
                        
                        {/* Footer */}
                        <div className="text-center mt-4">
                          <div className="inline-flex items-center gap-2 bg-[var(--background)] px-4 py-2 rounded-full border border-[var(--border)]">
                            <BookOpen className="w-4 h-4 text-[var(--foreground-secondary)]" />
                            <span className="text-sm text-[var(--foreground-secondary)] font-medium">Click to reveal answer</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Back */}
                  <div className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 ${isFlipped ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                    <Card className="w-full h-full bg-white dark:bg-[var(--background-secondary)] border-2 border-[var(--border)] hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] shadow-lg">
                      <CardContent className="p-6 h-full flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-[var(--primary)] rounded-full"></div>
                            <span className="text-sm font-semibold text-[var(--foreground-secondary)] uppercase tracking-wide">Answer</span>
                          </div>
                          <div className="text-xs text-[var(--foreground-tertiary)] bg-[var(--background)] px-2 py-1 rounded-full">
                            {currentCardIndex + 1} of {currentCards.length}
                          </div>
                        </div>
                        
                        {/* Answer Content */}
                        <div className="flex-1 flex items-center justify-center text-center">
                          {currentCard.answerImage ? (
                            <div className="space-y-3">
                              <img 
                                src={currentCard.answerImage} 
                                alt="Answer" 
                                className="max-w-full max-h-48 object-contain rounded-lg border border-[var(--border)]"
                              />
                              {currentCard.back && (
                                <p className="text-[var(--foreground)] text-2xl font-medium leading-relaxed max-w-lg">
                                  {currentCard.back}
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-[var(--foreground)] text-3xl font-medium leading-relaxed max-w-lg">
                              {currentCard.back}
                            </p>
                          )}
                        </div>
                        
                        {/* Footer */}
                        <div className="text-center mt-4">
                          <div className="inline-flex items-center gap-2 bg-[var(--background)] px-4 py-1 rounded-full border border-[var(--border)]">
                            <Check className="w-4 h-4 text-[var(--foreground)]" />
                            <span className="text-sm text-[var(--foreground)] font-medium">Answer revealed</span>
                          </div>
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
                onClick={() => {
                  markAsIncorrect();
                  setTimeout(() => handleNext(), 500);
                }}
                className="bg-[#FF6961]/80 hover:bg-[#FF6961]/70 text-white border border-[#FF6961]/60 h-12 px-6 transition-all duration-200 font-medium"
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
                className="bg-[#487CA5] dark:bg-[#447ACB] hover:bg-[#3D6B8A] dark:hover:bg-[#3A6BB8] text-white h-12 px-6 transition-all duration-200"
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
            className="bg-[#FF6961]/80 hover:bg-[#FF6961]/70 text-white border border-[#FF6961]/60 h-11 px-4 transition-all duration-200"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <div className="text-center">
            <div className="text-sm text-[var(--foreground-secondary)] mb-2">
              {studiedCards.size} of {currentCards.length} cards studied
            </div>
            <div className="flex items-center justify-center gap-4 text-xs">
              <div className="inline-flex items-center gap-2 bg-[var(--background)] px-3 py-1 rounded-full border border-[var(--border)]">
                <Check className="w-3 h-3 text-[var(--foreground)]" />
                <span className="text-[var(--foreground)] font-medium">{correctCards.size} correct</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-[var(--background)] px-3 py-1 rounded-full border border-[var(--border)]">
                <X className="w-3 h-3 text-[var(--foreground)]" />
                <span className="text-[var(--foreground)] font-medium">{incorrectCards.size} to review</span>
              </div>
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

                {/* Completion Overlay */}
        {isLastCard && studiedCards.has(currentCard.id) && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 p-8">
            <div className="w-full max-w-md">
              <Card className="bg-[var(--background)] border-[var(--border)] shadow-xl">
                <CardContent className="py-3 px-4">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-[var(--primary)] rounded-full flex items-center justify-center">
                      <Check className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-[var(--foreground)] mb-1 text-center">
                    Study Complete! 🎉
                  </h3>
                  <p className="text-[var(--foreground-secondary)] mb-4 text-center text-sm">
                    Great work! Here's your performance summary.
                  </p>
                  
                  {/* Stats Grid */}
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="bg-[var(--background-secondary)] rounded-md px-3 py-1 border border-[var(--border)]">
                      <div className="text-sm font-bold text-[var(--foreground)]">{correctCards.size} correct</div>
                    </div>
                    <div className="bg-[var(--background-secondary)] rounded-md px-3 py-1 border border-[var(--border)]">
                      <div className="text-sm font-bold text-[var(--foreground)]">{incorrectCards.size} review</div>
                    </div>
                    <div className="bg-[var(--background-secondary)] rounded-md px-3 py-1 border border-[var(--border)]">
                      <div className="text-sm font-bold text-[var(--foreground)]">{Math.round((correctCards.size / currentCards.length) * 100)}%</div>
                    </div>
                    <div className="bg-[var(--background-secondary)] rounded-md px-3 py-1 border border-[var(--border)]">
                      <div className="text-sm font-bold text-[var(--foreground)]">{formatTime(studyTime)}</div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      onClick={handleRestart}
                      variant="outline"
                      className="bg-[#77dd77]/80 dark:bg-[#77dd77]/80 hover:bg-[#77dd77]/90 dark:hover:bg-[#77dd77]/90 text-white dark:text-white border border-[#77dd77]/60 dark:border-[#77dd77]/60 h-11 px-6"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Study Again
                    </Button>
                    <Link href="/flashcards">
                      <Button className="bg-[#487CA5] dark:bg-[#447ACB] hover:bg-[#3D6B8A] dark:hover:bg-[#3A6BB8] text-white h-11 px-6">
                        Back to Flashcards
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
