"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BookOpen, RotateCcw, Plus, FolderOpen } from "lucide-react";
import { useFlashcardStore } from "@/lib/stores/flashcard-store";
import Link from "next/link";

export default function CreateFlashcardPage() {
  const { addFlashcard, sets, fetchSets, addSet } = useFlashcardStore();
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [selectedSetId, setSelectedSetId] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSetCreator, setShowSetCreator] = useState(false);
  const [newSetData, setNewSetData] = useState({
    name: "",
    description: "",
    color: "bg-blue-500"
  });

  useEffect(() => {
    fetchSets();
  }, [fetchSets]);

  useEffect(() => {
    if (sets.length > 0 && !selectedSetId) {
      setSelectedSetId(sets[0].id);
    }
  }, [sets, selectedSetId]);

  const selectedSet = sets.find(set => set.id === selectedSetId);

  const handleCreateSet = async () => {
    if (!newSetData.name.trim()) return;
    
    try {
      await addSet(newSetData.name.trim(), newSetData.description.trim() || undefined, newSetData.color);
      setNewSetData({ name: "", description: "", color: "bg-blue-500" });
      setShowSetCreator(false);
    } catch (error) {
      console.error("Failed to create set:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!front.trim() || !back.trim() || !selectedSetId) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await addFlashcard(front.trim(), back.trim(), selectedSetId);
      window.location.href = '/flashcards';
    } catch (error) {
      console.error("Failed to create flashcard:", error);
      alert("Failed to create flashcard. Please try again.");
      setIsSubmitting(false);
    }
  };

  const colors = [
    'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500',
    'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-red-500'
  ];

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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="set" className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
                      <FolderOpen className="h-4 w-4 text-[var(--primary)]" />
                      Study Set
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSetCreator(true)}
                      className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--hover)] px-3 py-1"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      New Set
                    </Button>
                  </div>
                  
                  {sets.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-[var(--border)] rounded-lg">
                      <FolderOpen className="h-12 w-12 text-[var(--foreground-tertiary)] mx-auto mb-4" />
                      <p className="text-[var(--foreground-secondary)] mb-4">No study sets yet</p>
                      <Button
                        type="button"
                        onClick={() => setShowSetCreator(true)}
                        className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Your First Set
                      </Button>
                    </div>
                  ) : (
                    <select
                      id="set"
                      value={selectedSetId}
                      onChange={(e) => setSelectedSetId(e.target.value)}
                      className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200 bg-[var(--background)] text-[var(--foreground)]"
                    >
                      {sets.map((set) => (
                        <option key={set.id} value={set.id}>
                          {set.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Question Input */}
                <div className="space-y-3">
                  <Label htmlFor="front" className="text-sm font-semibold text-[var(--foreground)]">
                    Question
                  </Label>
                  <Textarea
                    id="front"
                    placeholder="What would you like to learn?"
                    value={front}
                    onChange={(e) => setFront(e.target.value)}
                    className="min-h-[120px] px-3 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200 bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--foreground-tertiary)] resize-none"
                  />
                </div>

                {/* Answer Input */}
                <div className="space-y-3">
                  <Label htmlFor="back" className="text-sm font-semibold text-[var(--foreground)]">
                    Answer
                  </Label>
                  <Textarea
                    id="back"
                    placeholder="What's the answer or explanation?"
                    value={back}
                    onChange={(e) => setBack(e.target.value)}
                    className="min-h-[120px] px-3 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200 bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--foreground-tertiary)] resize-none"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={!front.trim() || !back.trim() || !selectedSetId || isSubmitting}
                    className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-6 py-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <BookOpen className="mr-2 h-5 w-5" />
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
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Flip
                </Button>
              )}
            </div>
            
            {/* Set Info */}
            {selectedSet && (
              <div className="mb-4 p-3 bg-[var(--hover)] rounded-lg">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 ${selectedSet.color} rounded-full`}></div>
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {selectedSet.name}
                  </span>
                  {selectedSet.description && (
                    <span className="text-[var(--foreground-secondary)] text-sm">
                      • {selectedSet.description}
                    </span>
                  )}
                </div>
              </div>
            )}
            
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
                    <div className="flashcard-face flashcard-front bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg">
                      <div className="absolute top-4 left-4">
                        <div className="w-3 h-3 bg-[var(--primary)] rounded-full"></div>
                      </div>
                      <div className="flex items-center justify-center h-full p-6">
                        <p className="text-center text-[var(--foreground)] font-medium">
                          {front.trim() || "Your question will appear here..."}
                        </p>
                      </div>
                    </div>

                    {/* Back */}
                    <div className="flashcard-face flashcard-back bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg">
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

      {/* Set Creator Modal */}
      {showSetCreator && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <Card className="bg-[var(--background)] border-[var(--border)] shadow-2xl max-w-md w-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-[var(--foreground)]">
                Create New Study Set
              </CardTitle>
              <p className="text-[var(--foreground-secondary)]">
                Organize your flashcards by subject or topic
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="setName" className="text-sm font-semibold text-[var(--foreground)]">
                  Set Name
                </Label>
                <Input
                  id="setName"
                  placeholder="e.g., Biology, Math, History"
                  value={newSetData.name}
                  onChange={(e) => setNewSetData({...newSetData, name: e.target.value})}
                  className="px-3 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200 bg-[var(--background)] text-[var(--foreground)]"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="setDescription" className="text-sm font-semibold text-[var(--foreground)]">
                  Description (optional)
                </Label>
                <Textarea
                  id="setDescription"
                  placeholder="Brief description of this set"
                  value={newSetData.description}
                  onChange={(e) => setNewSetData({...newSetData, description: e.target.value})}
                  className="px-3 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200 bg-[var(--background)] text-[var(--foreground)] resize-none"
                  rows={3}
                />
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-[var(--foreground)]">
                  Color Theme
                </Label>
                <div className="grid grid-cols-4 gap-3">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewSetData({...newSetData, color})}
                      className={`w-12 h-12 ${color} rounded-lg border-2 transition-all duration-300 ${
                        newSetData.color === color 
                          ? 'border-[var(--foreground)] scale-110' 
                          : 'border-[var(--border)] hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleCreateSet}
                  disabled={!newSetData.name.trim()}
                  className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white"
                >
                  Create Set
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowSetCreator(false)}
                  className="flex-1 border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--hover)]"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
