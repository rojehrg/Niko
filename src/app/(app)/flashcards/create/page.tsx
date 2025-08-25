"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Eye, EyeOff, Sparkles, BookOpen, RotateCcw, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFlashcardStore } from "@/lib/stores/flashcard-store";

export default function CreateFlashcardPage() {
  const router = useRouter();
  const { addFlashcard, sets, getDefaultSet } = useFlashcardStore();
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [selectedSetId, setSelectedSetId] = useState(getDefaultSet().id);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSetDropdownOpen, setIsSetDropdownOpen] = useState(false);

  const selectedSet = sets.find(set => set.id === selectedSetId) || getDefaultSet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;

    setIsLoading(true);
    
    // Save the flashcard with the selected set
    addFlashcard(front.trim(), back.trim(), selectedSetId);
    
    // Redirect back to flashcards page
    setTimeout(() => {
      setIsLoading(false);
      router.push("/flashcards");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[var(--background-secondary)] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/flashcards"
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--background)] border border-[var(--border)] hover:bg-[var(--hover)] transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 text-[var(--foreground-secondary)] group-hover:text-[var(--foreground)]" />
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-[var(--foreground)]">Create New Flashcard</h1>
              <p className="text-sm text-[var(--foreground-secondary)] mt-1">
                Build your knowledge with interactive study cards
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsPreviewMode(!isPreviewMode);
                setIsFlipped(false);
              }}
              className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
            >
              {isPreviewMode ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
              {isPreviewMode ? 'Edit' : 'Preview'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <Card className="bg-[var(--background)] border-[var(--border)]">
              <CardHeader className="pb-4">
                <div>
                  <CardTitle className="text-lg text-[var(--foreground)]">Card Content</CardTitle>
                  <CardDescription className="text-[var(--foreground-secondary)]">
                    Add your question and answer
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Set Selection */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <label className="text-sm font-medium text-[var(--foreground)]">
                        Flashcard Set
                      </label>
                    </div>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsSetDropdownOpen(!isSetDropdownOpen)}
                        className="w-full flex items-center justify-between p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-left hover:border-[var(--border-hover)] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 ${selectedSet.color} rounded-full`}></div>
                          <span className="text-[var(--foreground)]">{selectedSet.name}</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-[var(--foreground-secondary)] transition-transform ${isSetDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {isSetDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                          {sets.map((set) => (
                            <button
                              key={set.id}
                              type="button"
                              onClick={() => {
                                setSelectedSetId(set.id);
                                setIsSetDropdownOpen(false);
                              }}
                              className="w-full flex items-center gap-3 p-3 text-left hover:bg-[var(--hover)] transition-colors first:rounded-t-lg last:rounded-b-lg"
                            >
                              <div className={`w-4 h-4 ${set.color} rounded-full`}></div>
                              <span className="text-[var(--foreground)]">{set.name}</span>
                              {set.description && (
                                <span className="text-xs text-[var(--foreground-secondary)] ml-auto">
                                  {set.description}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[var(--foreground-tertiary)]">
                        {selectedSet.description || 'No description'}
                      </p>
                      <Link 
                        href="/flashcards/sets"
                        className="text-xs text-[var(--primary)] hover:underline"
                      >
                        Manage Sets
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <label htmlFor="front" className="text-sm font-medium text-[var(--foreground)]">
                        Question (Front Side)
                      </label>
                    </div>
                    <Textarea
                      id="front"
                      placeholder="What is the capital of France?"
                      value={front}
                      onChange={(e) => setFront(e.target.value)}
                      className="min-h-[120px] bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--foreground-tertiary)] focus:border-[var(--primary)] transition-colors resize-none"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <label htmlFor="back" className="text-sm font-medium text-[var(--foreground)]">
                        Answer (Back Side)
                      </label>
                    </div>
                    <Textarea
                      id="back"
                      placeholder="Paris"
                      value={back}
                      onChange={(e) => setBack(e.target.value)}
                      className="min-h-[120px] bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--foreground-tertiary)] focus:border-[var(--primary)] transition-colors resize-none"
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={isLoading || !front.trim() || !back.trim()}
                      className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white h-12 btn-interactive"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Creating...
                        </div>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
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
                </form>
              </CardContent>
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
    </div>
  );
}
