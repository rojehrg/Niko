"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Edit, Trash2, BookOpen, FolderOpen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFlashcardStore, FlashcardSet } from "@/lib/stores/flashcard-store";

export default function FlashcardSetsPage() {
  const router = useRouter();
  const { sets, addSet, removeSet, updateSet, getFlashcardsBySet } = useFlashcardStore();
  const [isCreating, setIsCreating] = useState(false);
  const [editingSet, setEditingSet] = useState<FlashcardSet | null>(null);
  const [deletingSet, setDeletingSet] = useState<FlashcardSet | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "bg-blue-500"
  });

  const colors = [
    'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500',
    'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-red-1000'
  ];

  const handleCreateSet = async () => {
    if (!formData.name.trim()) return;
    
    try {
      await addSet(formData.name.trim(), formData.description.trim() || undefined, formData.color);
      setFormData({ name: "", description: "", color: "bg-blue-500" });
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to create set:", error);
    }
  };

  const handleUpdateSet = async () => {
    if (!editingSet || !formData.name.trim()) return;
    
    try {
      await updateSet(editingSet.id, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        color: formData.color
      });
      
      setEditingSet(null);
      setFormData({ name: "", description: "", color: "bg-blue-500" });
    } catch (error) {
      console.error("Failed to update set:", error);
    }
  };

  const handleEditSet = (set: FlashcardSet) => {
    setEditingSet(set);
    setFormData({
      name: set.name,
      description: set.description || "",
      color: set.color
    });
  };

  const handleDeleteSet = (setId: string) => {
    const set = sets.find(s => s.id === setId);
    if (set) {
      setDeletingSet(set);
    }
  };

  const confirmDeleteSet = async () => {
    if (deletingSet) {
      try {
        await removeSet(deletingSet.id);
        setDeletingSet(null);
      } catch (error) {
        console.error("Failed to delete set:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", color: "bg-blue-500" });
    setIsCreating(false);
    setEditingSet(null);
  };

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto">
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
            <h1 className="text-2xl font-semibold text-[var(--foreground)]">Flashcard Sets</h1>
            <p className="text-sm text-[var(--foreground-secondary)] mt-1">
              Organize your flashcards by class or topic
            </p>
          </div>
        </div>
        
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Set
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingSet) && (
        <Card className="bg-[var(--background)] border-[var(--border)] mb-8">
          <CardHeader>
            <CardTitle className="text-lg text-[var(--foreground)]">
              {editingSet ? 'Edit Set' : 'Create New Set'}
            </CardTitle>
            <CardDescription className="text-[var(--foreground-secondary)]">
              {editingSet ? 'Update your flashcard set' : 'Create a new set to organize your flashcards'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-[var(--foreground)]">
                  Set Name *
                </label>
                <Input
                  placeholder="e.g., Biology 101, Math Formulas, Spanish Vocabulary"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--foreground-tertiary)]"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex gap-2 flex-wrap justify-center">
                  <label className="text-sm font-medium text-[var(--foreground)] text-center w-full mb-2">
                    Color Theme
                  </label>
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-full ${color} border-2 transition-all ${
                        formData.color === color 
                          ? 'border-[var(--foreground)] scale-110' 
                          : 'border-[var(--border)] hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-[var(--foreground)]">
                Description (Optional)
              </label>
              <Textarea
                placeholder="Brief description of what this set contains..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--foreground-tertiary)]"
                rows={3}
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                onClick={editingSet ? handleUpdateSet : handleCreateSet}
                disabled={!formData.name.trim()}
                className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white"
              >
                {editingSet ? 'Update Set' : 'Create Set'}
              </Button>
              <Button
                onClick={resetForm}
                className="bg-red-100 hover:bg-red-200 text-[var(--foreground)] dark:bg-red-900/30 dark:hover:bg-red-800/40"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingSet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 bg-[var(--background)] border-[var(--border)] shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-xl text-[var(--foreground)]">
                Delete Flashcard Set
              </CardTitle>
              <CardDescription className="text-[var(--foreground-secondary)]">
                Are you sure you want to delete &quot;{deletingSet.name}&quot;?
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-6">
              <div className="bg-red-100 dark:bg-red-950/10 border border-red-300 dark:border-red-700 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-700 dark:text-red-300">
                  ⚠️ This action cannot be undone. All {getFlashcardsBySet(deletingSet.id).length} flashcards in this set will also be deleted.
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => setDeletingSet(null)}
                  className="flex-1 bg-red-100 hover:bg-red-200 text-[var(--foreground)] py-2.5 px-4 rounded-lg transition-all duration-200 font-medium dark:bg-red-900/30 dark:hover:bg-red-800/40"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDeleteSet}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Set
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sets Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sets.map((set) => {
          const cardCount = getFlashcardsBySet(set.id).length;
          return (
            <Card 
              key={set.id} 
              className="bg-[var(--background)] border-[var(--border)] hover:border-[var(--border-hover)] transition-all duration-300 group cursor-pointer"
              onClick={() => router.push(`/flashcards?set=${set.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${set.color} rounded-lg flex items-center justify-center`}>
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditSet(set);
                      }}
                      className="h-8 w-8 p-0 text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSet(set.id);
                      }}
                      className="h-8 w-8 p-0 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
                      {cardCount} card{cardCount !== 1 ? 's' : ''}
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

      {/* Empty State */}
      {sets.length === 0 && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center mb-6">
            <img src="/sprites/flashcards.png" alt="Flashcards" className="h-16 w-16" />
          </div>
          <h3 className="text-xl font-medium text-[var(--foreground)] mb-2">
            No sets created yet
          </h3>
          <p className="text-[var(--foreground-secondary)] mb-6 text-sm">
            Create your first set to start organizing flashcards
          </p>
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create First Set
          </Button>
        </div>
      )}
    </div>
  );
}
