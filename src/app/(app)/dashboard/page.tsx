"use client";

import { BookOpen, Briefcase, StickyNote } from "lucide-react";
import { useFlashcardStore } from "@/lib/stores/flashcard-store";
import { useNotesStore } from "@/lib/stores/notes-store";
import { useJobsStore } from "@/lib/stores/jobs-store";

export default function DashboardPage() {
  console.log('DashboardPage: Rendering...');
  
  const { flashcards } = useFlashcardStore();
  const { notes } = useNotesStore();
  const { getStats: getJobStats } = useJobsStore();
  
  const jobStats = getJobStats();
  
  console.log('DashboardPage: Data loaded:', { flashcards: flashcards.length, notes: notes.length, jobStats });
  
  try {
    return (
      <div className="min-h-screen p-8" style={{ 
        background: 'transparent',
        boxShadow: 'none',
        outline: 'none',
        border: 'none'
      }}>
        {/* Modern Header */}
        <div className="mb-12">
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-[var(--foreground)] tracking-tight">
              {'Welcome back, Niko'.split('').map((letter, index) => (
                <span key={index} className="animate-sparkle inline-block">
                  {letter === ' ' ? '\u00A0' : letter}
                </span>
              ))}
            </h1>
          </div>
          <p className="text-lg text-[var(--foreground-secondary)] font-medium">
            Your personal learning and productivity hub
          </p>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          {/* Learning Overview */}
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-6 hover:border-[var(--border-hover)] transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-200 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-6 w-6 text-blue-700 dark:text-blue-400" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {flashcards.length + notes.length >= 10 ? '🚀' : '📚'}
                </div>
                <div className="text-xs text-[var(--foreground-secondary)] font-medium">
                  {flashcards.length + notes.length >= 10 ? 'Learning champion' : 'Keep learning'}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-[var(--foreground)]">
                {flashcards.length + notes.length}
              </p>
              <p className="text-sm text-[var(--foreground-secondary)] font-medium">Learning Items</p>
              <div className="w-full bg-[var(--hover)] rounded-full h-2">
                <div 
                  className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min((flashcards.length + notes.length) / 20 * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-[var(--foreground-tertiary)]">
                {flashcards.length + notes.length >= 20 ? '🎓 Study master!' : `${20 - (flashcards.length + notes.length)} more to study`}
              </p>
            </div>
          </div>

          {/* Career Activity */}
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-6 hover:border-[var(--border-hover)] transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-200 dark:bg-orange-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="h-6 w-6 text-orange-700 dark:text-orange-400" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {jobStats.total > 0 ? '🚀' : '💼'}
                </div>
                <div className="text-xs text-[var(--foreground-secondary)] font-medium">
                  {jobStats.total > 0 ? 'Momentum' : 'Start applying'}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-[var(--foreground)]">
                {jobStats.total}
              </p>
              <p className="text-sm text-[var(--foreground-secondary)] font-medium">Job Applications</p>
              <div className="w-full bg-[var(--hover)] rounded-full h-2">
                <div 
                  className="bg-orange-500 dark:bg-orange-400 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(jobStats.total / 10 * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-[var(--foreground-tertiary)]">
                {jobStats.total >= 10 ? '🎯 Career focused!' : `${10 - jobStats.total} more to momentum`}
              </p>
            </div>
          </div>

          {/* Notes Overview */}
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-6 hover:border-[var(--border-hover)] transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-200 dark:bg-purple-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <StickyNote className="h-6 w-6 text-purple-700 dark:text-purple-400" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {notes.length >= 15 ? '✨' : '📝'}
                </div>
                <div className="text-xs text-[var(--foreground-secondary)] font-medium">
                  {notes.length >= 15 ? 'Note master' : 'Keep writing'}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-[var(--foreground)]">
                {notes.length}
              </p>
              <p className="text-sm text-[var(--foreground-secondary)] font-medium">Notes Created</p>
              <div className="w-full bg-[var(--hover)] rounded-full h-2">
                <div 
                  className="bg-purple-500 dark:bg-purple-400 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(notes.length / 25 * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-[var(--foreground-tertiary)]">
                {notes.length >= 25 ? '📚 Knowledge keeper!' : `${25 - notes.length} more to keeper`}
              </p>
            </div>
          </div>
        </div>


      </div>
    );
  } catch (error) {
    console.error('DashboardPage Error:', error);
    return (
      <div className="min-h-screen bg-[var(--background-secondary)] p-6 max-w-7xl mx-auto">
        <div className="text-center py-16">
          <h1 className="text-2xl font-semibold text-[var(--foreground)] mb-4">Something went wrong</h1>
          <p className="text-[var(--foreground-secondary)] mb-4">There was an error loading the dashboard</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
}
