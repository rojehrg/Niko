"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BookOpen, RotateCcw } from "lucide-react";
import { useFlashcardStore } from "@/lib/stores/flashcard-store";
import Link from "next/link";

export default function CreateFlashcardPage() {
  const { addFlashcard, sets, fetchSets, getDefaultSet } = useFlashcardStore();
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [selectedSetId, setSelectedSetId] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSets();
  }, [fetchSets]);

  useEffect(() => {
    if (sets.length > 0 && !selectedSetId) {
      setSelectedSetId(sets[0].id);
    }
  }, [sets, selectedSetId]);

  const selectedSet = sets.find(set => set.id === selectedSetId) || getDefaultSet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!front.trim() || !back.trim() || !selectedSetId) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await addFlashcard(front.trim(), back.trim(), selectedSetId);
      
      // Reset form
      setFront("");
      setBack("");
      setIsFlipped(false);
      
      // Show success message or redirect
      alert("Flashcard created successfully!");
    } catch (error) {
      console.error("Failed to create flashcard:", error);
      alert("Failed to create flashcard. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[var(--foreground)] tracking-tight mb-3">
          Create New Flashcard
        </h1>
        <p className="text-lg text-[var(--foreground-secondary)] font-medium">
          Add new flashcards to your study sets
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          <Card className="border border-[var(--border)] shadow-lg bg-[var(--background)] rounded-xl">
            <CardHeader className="pb-6 border-b border-[var(--border)] bg-[var(--background-secondary)] rounded-t-xl">
              <CardTitle className="text-2xl font-bold text-[var(--foreground)]">
                Flashcard Details
              </CardTitle>
              <p className="text-[var(--foreground-secondary)] mt-2">
                Fill in the question and answer for your new flashcard
              </p>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="p-8 space-y-8">
                
                {/* Flashcard Set Selection */}
                <div className="space-y-3">
                  <Label htmlFor="set" className="text-sm font-semibold text-[var(--foreground)]">
                    Flashcard Set
                  </Label>
                  <select
                    id="set"
                    value={selectedSetId}
                    onChange={(e) => setSelectedSetId(e.target.value)}
                    className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200 bg-[var(--background-secondary)] text-[var(--foreground)]"
                  >
                    {sets.map((set) => (
                      <option key={set.id} value={set.id}>
                        {set.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Question (Front Side) */}
                <div className="space-y-3">
                  <Label htmlFor="front" className="text-sm font-semibold text-[var(--foreground)]">
                    Question (Front Side)
                  </Label>
                  <Textarea
                    id="front"
                    value={front}
                    onChange={(e) => setFront(e.target.value)}
                    placeholder="Enter your question here..."
                    className="min-h-32 border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] resize-none transition-all duration-200 rounded-lg"
                  />
                </div>

                {/* Answer (Back Side) */}
                <div className="space-y-3">
                  <Label htmlFor="back" className="text-sm font-semibold text-[var(--foreground)]">
                    Answer (Back Side)
                  </Label>
                  <Textarea
                    id="back"
                    value={back}
                    onChange={(e) => setBack(e.target.value)}
                    placeholder="Enter your answer here..."
                    className="min-h-32 border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] resize-none transition-all duration-200 rounded-lg"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-8 border-t border-[var(--border)]">
                  <Button
                    type="submit"
                    disabled={!front.trim() || !back.trim() || !selectedSetId || isSubmitting}
                    className="flex-1 h-12 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating...
                      </div>
                    ) : (
                      <>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Create Flashcard
                      </>
                    )}
                  </Button>
                  <Link
                    href="/flashcards"
                    className="inline-flex items-center justify-center rounded-lg text-sm font-medium border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--hover)] text-[var(--foreground)] h-12 px-6 transition-colors"
                  >
                    Cancel
                  </Link>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-[var(--foreground)]">Live Preview</h3>
              {(front.trim() || back.trim()) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
                >
                  <RotateCcw className="mr-2 h-3 w-3" />
                  Flip
                </Button>
              )}
            </div>
            
            {/* Set Info */}
            <div className="mb-4 p-3 bg-[var(--hover)] rounded-lg">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 ${selectedSet.color} rounded-full`}></div>
                <span className="text-sm font-medium text-[var(--foreground)]">
                  {selectedSet.name}
                </span>
              </div>
            </div>
            
            {!front.trim() && !back.trim() ? (
              <div className="aspect-[3/2] border-2 border-dashed border-[var(--border)] rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BookOpen className="h-8 w-8 text-[var(--foreground-tertiary)] mx-auto mb-2" />
                  <p className="text-sm text-[var(--foreground-tertiary)]">Start typing to see preview</p>
                </div>
              </div>
            ) : (
              <div className="aspect-[3/2] relative">
                <div 
                  className="w-full h-full relative perspective-1000 cursor-pointer"
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  <div className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}>
                    {/* Front */}
                    <div className="flashcard-face flashcard-front bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800">
                      <div className="absolute top-4 left-4">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      </div>
                      <div className="flex items-center justify-center h-full p-6">
                        <p className="text-center text-[var(--foreground)] font-medium">
                          {front.trim() || "Your question will appear here..."}
                        </p>
                      </div>
                    </div>

                    {/* Back */}
                    <div className="flashcard-face flashcard-back bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800">
                      <div className="absolute top-4 left-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="flex items-center justify-center h-full p-6">
                        <p className="text-center text-[var(--foreground)] font-medium">
                          {back.trim() || "Your answer will appear here..."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {(front.trim() || back.trim()) && (
              <p className="text-xs text-[var(--foreground-tertiary)] text-center mt-4">
                Click the card to flip between question and answer
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
