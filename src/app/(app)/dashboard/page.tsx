"use client";

import { useEffect } from "react";
import { BookOpen, Briefcase, StickyNote } from "lucide-react";
import { useFlashcardStore } from "@/lib/stores/flashcard-store";
import { useNotesStore } from "@/lib/stores/notes-store";
import { useJobsStore } from "@/lib/stores/jobs-store";

export default function DashboardPage() {
  const { flashcards, fetchFlashcards, fetchSets } = useFlashcardStore();
  const { notes, fetchNotes } = useNotesStore();
  const { jobs, fetchJobs } = useJobsStore();
  
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
          fetchJobs()
        ]);
      } catch (error) {
        console.log('Some data failed to load (this is normal when running locally without Supabase):', error);
      }
    };
    
    fetchData();
  }, [fetchNotes, fetchFlashcards, fetchSets, fetchJobs]);
  
  return (
    <div className="min-h-screen p-8">
      {/* Modern Header */}
      <div className="mb-12">
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-[var(--foreground)] tracking-tight">
            Welcome back, Niko
          </h1>
        </div>
        <p className="text-lg text-[var(--foreground-secondary)] font-medium">
          Your personal learning and productivity hub
        </p>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid gap-6 md:grid-cols-3 mb-12">
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
      </div>

      {/* Cool Dashboard Widgets */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Productivity Streak Tracker */}
        <div className="bg-gradient-to-br from-purple-600/20 via-purple-500/15 to-pink-600/20 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
            🔥 Productivity Streak
          </h2>
          <div className="text-center">
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
              {Math.floor(Math.random() * 7) + 1}
            </div>
            <p className="text-sm text-[var(--foreground-secondary)] mb-4 font-medium">days in a row</p>
            <div className="flex justify-center gap-2 mb-4">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    i < Math.floor(Math.random() * 7) + 1
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50 animate-pulse'
                      : 'bg-[var(--hover)] border border-[var(--border)]'
                  }`}
                />
              ))}
            </div>
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30">
              <p className="text-xs text-[var(--foreground)] font-semibold">
                Keep the momentum going! 💪
              </p>
            </div>
          </div>
        </div>

        {/* Weather & Mood Widget */}
        <div className="bg-gradient-to-br from-blue-600/20 via-cyan-500/15 to-teal-600/20 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
            🌤️ Today's Vibe
          </h2>
          <div className="text-center">
            <div className="text-6xl mb-3">☀️</div>
            <div className="text-2xl font-bold text-[var(--foreground)] mb-1">72°F</div>
            <p className="text-sm text-[var(--foreground-secondary)] mb-4">Sunny & Productive</p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <div className="text-xs text-[var(--foreground-secondary)]">Humidity</div>
                <div className="font-semibold text-[var(--foreground)]">45%</div>
              </div>
              <div className="p-2 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
                <div className="text-xs text-[var(--foreground-secondary)]">Wind</div>
                <div className="font-semibold text-[var(--foreground)]">8 mph</div>
              </div>
              <div className="p-2 bg-teal-500/20 rounded-lg border border-teal-500/30">
                <div className="text-xs text-[var(--foreground-secondary)]">UV Index</div>
                <div className="font-semibold text-[var(--foreground)]">Low</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline & Stats */}
      <div className="bg-gradient-to-r from-slate-600/20 via-gray-500/15 to-zinc-600/20 border border-slate-500/30 rounded-2xl p-6 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
          📊 Activity Overview
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Learning Progress */}
          <div className="text-center p-4 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl border border-emerald-500/30">
            <div className="text-3xl mb-2">📚</div>
            <div className="text-2xl font-bold text-[var(--foreground)] mb-1">
              {Math.floor((flashcards?.length || 0) / 20 * 100)}%
            </div>
            <p className="text-sm text-[var(--foreground-secondary)]">Learning Goal</p>
            <div className="mt-3 w-full bg-[var(--hover)] rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min((flashcards?.length || 0) / 20 * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Notes Progress */}
          <div className="text-center p-4 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-500/30">
            <div className="text-3xl mb-2">✍️</div>
            <div className="text-2xl font-bold text-[var(--foreground)] mb-1">
              {Math.floor((notes?.length || 0) / 15 * 100)}%
            </div>
            <p className="text-sm text-[var(--foreground-secondary)]">Knowledge Base</p>
            <div className="mt-3 w-full bg-[var(--hover)] rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min((notes?.length || 0) / 15 * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Career Progress */}
          <div className="text-center p-4 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl border border-orange-500/30">
            <div className="text-3xl mb-2">🚀</div>
            <div className="text-2xl font-bold text-[var(--foreground)] mb-1">
              {Math.floor((jobs?.length || 0) / 25 * 100)}%
            </div>
            <p className="text-sm text-[var(--foreground-secondary)]">Career Goals</p>
            <div className="mt-3 w-full bg-[var(--hover)] rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min((jobs?.length || 0) / 25 * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Calendar & Time Widget */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Mini Calendar */}
        <div className="bg-gradient-to-br from-rose-600/20 via-pink-500/15 to-fuchsia-600/20 border border-rose-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
            📅 This Week
          </h2>
          <div className="grid grid-cols-7 gap-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={day} className="text-center">
                <div className="text-xs text-[var(--foreground-secondary)] mb-1">{day}</div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                  i === new Date().getDay() 
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/50' 
                    : 'bg-[var(--background-secondary)] text-[var(--foreground-secondary)]'
                }`}>
                  {new Date().getDate() - new Date().getDay() + i}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <div className="text-sm text-[var(--foreground-secondary)]">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>

        {/* Time & Focus Widget */}
        <div className="bg-gradient-to-br from-violet-600/20 via-purple-500/15 to-indigo-600/20 border border-violet-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
            ⏰ Focus Time
          </h2>
          <div className="text-center">
            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 mb-2">
              {new Date().getHours()}:{new Date().getMinutes().toString().padStart(2, '0')}
            </div>
            <p className="text-sm text-[var(--foreground-secondary)] mb-4">
              {new Date().getHours() < 12 ? '🌅 Good Morning!' : 
               new Date().getHours() < 17 ? '☀️ Good Afternoon!' : '🌙 Good Evening!'}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-violet-500/20 rounded-lg border border-violet-500/30">
                <span className="text-sm text-[var(--foreground-secondary)]">Focus Score</span>
                <span className="font-semibold text-[var(--foreground)]">85%</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <span className="text-sm text-[var(--foreground-secondary)]">Energy Level</span>
                <span className="font-semibold text-[var(--foreground)]">⚡ High</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
