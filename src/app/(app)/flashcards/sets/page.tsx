"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

  const getColorValue = (colorClass: string) => {
    const colorMap: { [key: string]: string } = {
      'bg-blue-500': '#3b82f6',
      'bg-green-500': '#10b981',
      'bg-purple-500': '#8b5cf6',
      'bg-orange-500': '#f97316',
      'bg-red-500': '#ef4444',
      'bg-pink-500': '#ec4899',
      'bg-indigo-500': '#6366f1',
      'bg-yellow-500': '#eab308',
      'bg-teal-500': '#14b8a6',
      'bg-red-1000': '#dc2626'
    };
    return colorMap[colorClass] || '#3b82f6'; // default to blue
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

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
              Create, edit, and manage your flashcard collections
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



      {/* Delete Confirmation Dialog */}
      {deletingSet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 bg-[var(--background)] border-[var(--border)] shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl text-[var(--foreground)]">
                Delete Flashcard Set
              </CardTitle>
              <CardDescription className="text-[var(--foreground-secondary)]">
                Are you sure you want to delete &quot;{deletingSet.name}&quot;?
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-6">
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => setDeletingSet(null)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg transition-all duration-200 font-medium"
                >
                  Nevermind
                </Button>
                <Button
                  onClick={confirmDeleteSet}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg transition-all duration-200 font-medium"
                >
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
              style={{ borderLeft: `4px solid ${getColorValue(set.color)}` }}
              onClick={() => router.push(`/flashcards?set=${set.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-xs text-[var(--foreground-secondary)] bg-[var(--background-secondary)] px-2 py-0.5 rounded-full">
                    {cardCount} card{cardCount !== 1 ? 's' : ''}
                  </div>
                  <div className="flex items-center gap-2">
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
                      className="h-8 w-8 p-0 text-[var(--foreground-secondary)] hover:text-red-500"
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
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-[var(--foreground-secondary)]">
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

      {/* Create/Edit Set Modal */}
      {(isCreating || editingSet) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <Card className="bg-[var(--background)] border-[var(--border)] shadow-2xl max-w-md w-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-[var(--foreground)]">
                {editingSet ? 'Edit Study Set' : 'Create New Study Set'}
              </CardTitle>
              <p className="text-[var(--foreground-secondary)]">
                {editingSet ? 'Update your flashcard set' : 'Organize your flashcards by subject or topic'}
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
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="px-3 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200 bg-[var(--background)] text-[var(--foreground)]"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="setDescription" className="text-sm font-semibold text-[var(--foreground)]">
                  Description (optional)
                </Label>
                <Textarea
                  id="setDescription"
                  placeholder="Brief description of what this set contains..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="px-3 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200 bg-[var(--background)] text-[var(--foreground)] resize-none"
                  rows={3}
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex gap-2 flex-wrap justify-center">
                  <Label className="text-sm font-medium text-[var(--foreground)] text-center w-full mb-2">
                    Color Theme
                  </Label>
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({...formData, color})}
                      className={`w-8 h-8 rounded-full ${color} border-2 transition-all ${
                        formData.color === color 
                          ? 'border-[var(--foreground)] scale-110' 
                          : 'border-[var(--border)] hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={editingSet ? handleUpdateSet : handleCreateSet}
                  disabled={!formData.name.trim()}
                  className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white"
                >
                  {editingSet ? 'Update Set' : 'Create Set'}
                </Button>
                <Button
                  onClick={resetForm}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
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
