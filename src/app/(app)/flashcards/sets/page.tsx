"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Edit, Trash2, BookOpen, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFlashcardStore, FlashcardSet } from "@/lib/stores/flashcard-store";

export default function FlashcardSetsPage() {
  const router = useRouter();
  const { sets, addSet, removeSet, updateSet, getFlashcardsBySet } = useFlashcardStore();
  const [isCreating, setIsCreating] = useState(false);
  const [editingSet, setEditingSet] = useState<FlashcardSet | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "bg-blue-500"
  });

  const colors = [
    'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500',
    'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-red-500'
  ];

  const handleCreateSet = () => {
    if (!formData.name.trim()) return;
    
    addSet(formData.name.trim(), formData.description.trim() || undefined, formData.color);
    setFormData({ name: "", description: "", color: "bg-blue-500" });
    setIsCreating(false);
  };

  const handleUpdateSet = () => {
    if (!editingSet || !formData.name.trim()) return;
    
    updateSet(editingSet.id, {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      color: formData.color
    });
    
    setEditingSet(null);
    setFormData({ name: "", description: "", color: "bg-blue-500" });
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
    if (confirm("Are you sure you want to delete this set? All cards will be moved to the General set.")) {
      removeSet(setId);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", color: "bg-blue-500" });
    setIsCreating(false);
    setEditingSet(null);
  };

  return (
    <div className="min-h-screen bg-[var(--background-secondary)] p-6">
      <div className="max-w-6xl mx-auto">
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
                  <label className="text-sm font-medium text-[var(--foreground)]">
                    Color Theme
                  </label>
                  <div className="flex gap-2 flex-wrap">
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
                  variant="outline"
                  onClick={resetForm}
                  className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--hover)]"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
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
                      {set.id !== 'default' && (
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
                      )}
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--background)] border border-[var(--border)] rounded-lg mb-6">
              <BookOpen className="h-10 w-10 text-[var(--foreground-tertiary)]" />
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
    </div>
  );
}
