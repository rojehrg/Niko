"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Briefcase, StickyNote, Calendar } from "lucide-react";
import { useFlashcardStore } from "@/lib/stores/flashcard-store";
import { useNotesStore } from "@/lib/stores/notes-store";
import { useJobsStore } from "@/lib/stores/jobs-store";
import { useExamsStore } from "@/lib/stores/exams-store";
import { GamificationWidget } from "@/components/ui/gamification-widget";
import { useAuth } from "@/lib/contexts/auth-context";

export default function DashboardPage() {
  const { flashcards, fetchFlashcards, fetchSets } = useFlashcardStore();
  const { notes, fetchNotes } = useNotesStore();
  const { jobs, fetchJobs } = useJobsStore();
  const { exams, fetchExams } = useExamsStore();
  const { userProfile, signOut } = useAuth();
  
  // Calculate job stats manually since getStats might not exist
  const jobStats = {
    total: jobs?.length || 0,
    applied: jobs?.filter(job => job.status === 'applied')?.length || 0,
    interview: jobs?.filter(job => job.status === 'interview')?.length || 0,
    offer: jobs?.filter(job => job.status === 'offer')?.length || 0,
    rejected: jobs?.filter(job => job.status === 'rejected')?.length || 0
  };

  // Fetch data from Supabase on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchNotes(),
          fetchFlashcards(),
          fetchSets(),
          fetchJobs(),
          fetchExams()
        ]);
      } catch (error) {
        console.log('Some data failed to load (this is normal when running locally without Supabase):', error);
      }
    };
    
    fetchData();
  }, [fetchNotes, fetchFlashcards, fetchSets, fetchJobs, fetchExams]);
  
  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      {/* Modern Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[var(--foreground)] tracking-tight mb-3">
            Welcome back, {userProfile?.name || 'StudyBuddy'}! 👋
          </h1>
          <p className="text-lg text-[var(--foreground-secondary)] font-medium">
            Your personal learning and productivity hub
          </p>
        </div>
        
        <button
          onClick={() => {
            // Use the auth context signOut instead of localStorage
            signOut();
          }}
          className="px-4 py-2 text-sm font-medium text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--hover)] rounded-lg transition-all duration-200"
        >
          Sign Out
        </button>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
        {/* Learning Overview */}
        <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-6 hover:border-[var(--border)] transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-md">
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
              {(flashcards?.length || 0) + (notes?.length || 0)}
            </p>
            <p className="text-sm text-[var(--foreground-secondary)] font-medium">Learning Items</p>
            <div className="w-full bg-[var(--hover)] rounded-full h-2">
              <div 
                className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(((flashcards?.length || 0) + (notes?.length || 0)) / 20 * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-[var(--foreground-secondary)]">
              {(flashcards?.length || 0) + (notes?.length || 0) >= 20 ? '🎓 Study master!' : `${20 - ((flashcards?.length || 0) + (notes?.length || 0))} more to study`}
            </p>
          </div>
        </div>

        {/* Career Activity */}
        <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-6 hover:border-[var(--border)] transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-md">
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
            <p className="text-xs text-[var(--foreground-secondary)]">
              {jobStats.total >= 10 ? '🎯 Career focused!' : `${10 - jobStats.total} more to build momentum`}
            </p>
          </div>
        </div>

        {/* Notes Overview */}
        <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-6 hover:border-[var(--border)] transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-200 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <StickyNote className="h-6 w-6 text-green-700 dark:text-green-400" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {notes.length >= 5 ? '📝' : '✏️'}
              </div>
              <div className="text-xs text-[var(--foreground-secondary)] font-medium">
                {notes.length >= 5 ? 'Note taker' : 'Start writing'}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-[var(--foreground)]">
              {notes.length}
            </p>
            <p className="text-sm text-[var(--foreground-secondary)] font-medium">Notes</p>
            <div className="w-full bg-[var(--hover)] rounded-full h-2">
              <div 
                className="bg-green-500 dark:bg-green-400 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(notes.length / 10 * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-[var(--foreground-secondary)]">
              {notes.length >= 10 ? '📚 Knowledge base!' : `${10 - notes.length} more to build knowledge`}
            </p>
          </div>
        </div>

        {/* Exams Overview */}
        <Link href="/exams" className="block">
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-6 hover:border-[var(--border)] transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-200 dark:bg-purple-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-6 w-6 text-purple-700 dark:text-purple-400" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {exams?.length > 0 ? '📅' : '⏰'}
                </div>
                <div className="text-xs text-[var(--foreground-secondary)] font-medium">
                  {exams?.length > 0 ? 'Stay on track' : 'Plan ahead'}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-[var(--foreground)]">
                {exams?.filter(e => !e.completed).length || 0}
              </p>
              <p className="text-sm text-[var(--foreground-secondary)] font-medium">Active Exams</p>
              <div className="w-full bg-[var(--hover)] rounded-full h-2">
                <div 
                  className="bg-purple-500 dark:bg-purple-400 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min((exams?.filter(e => !e.completed).length || 0) / 5 * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-[var(--foreground-secondary)]">
                {(exams?.filter(e => !e.completed).length || 0) >= 5 ? '📚 Exam master!' : `${5 - (exams?.filter(e => !e.completed).length || 0)} more to stay organized`}
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Gamification Section */}
      <div className="mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
            🎮 Stay Motivated
          </h2>
          <p className="text-[var(--foreground-secondary)]">
            Track your progress, unlock achievements, and build streaks
          </p>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-1">
          <GamificationWidget />
        </div>
      </div>
    </div>
  );
}
