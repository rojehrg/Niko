'use client';

import { useEffect, useState } from 'react';
import { Calendar, BookOpen, Briefcase, Target, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useFlashcardStore } from '@/lib/stores/flashcard-store';
import { useNotesStore } from '@/lib/stores/notes-store';
import { useJobsStore } from '@/lib/stores/jobs-store';
import { useExamsStore } from '@/lib/stores/exams-store';

import { GamificationWidget } from '@/components/ui/gamification-widget';

export default function DashboardPage() {
  const { flashcards, fetchFlashcards } = useFlashcardStore();
  const { notes, fetchNotes } = useNotesStore();
  const { jobs, fetchJobs } = useJobsStore();
  const { exams, fetchExams } = useExamsStore();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchFlashcards(),
          fetchNotes(),
          fetchJobs(),
          fetchExams()
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchFlashcards, fetchNotes, fetchJobs, fetchExams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--foreground-secondary)]">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const totalFlashcards = flashcards.length;
  const totalNotes = notes.length;
  const totalJobs = jobs.length;
  const upcomingExams = exams.filter(exam => !exam.completed).length;


  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">
            <span className="inline-block">
              {'Welcome back, Nikho!'.split('').map((char, index) => (
                <span
                  key={index}
                  className="inline-block"
                  style={{
                    animationDelay: `${index * 0.15}s`,
                    animationDuration: '2s',
                    animationIterationCount: 'infinite',
                    animationName: 'gentleBounce'
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
              <span
                className="inline-block ml-2"
                style={{
                  animationDelay: '2.7s',
                  animationDuration: '2s',
                  animationIterationCount: 'infinite',
                  animationName: 'gentleBounce'
                }}
              >
                👋
              </span>
            </span>
            
            <style jsx>{`
              @keyframes gentleBounce {
                0%, 100% {
                  transform: translateY(0);
                }
                25% {
                  transform: translateY(-8px);
                }
                50% {
                  transform: translateY(-4px);
                }
                75% {
                  transform: translateY(-6px);
                }
              }
            `}</style>
          </h1>
          <p className="text-lg text-[var(--foreground-secondary)]">
            Here's what's happening with your studies today
          </p>
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Flashcards */}
            <div className="group bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-5 hover:border-[var(--border-hover)] hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                  <span className="text-2xl">
                    {totalFlashcards >= 50 ? '📚' : '📖'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--foreground-secondary)] mb-1">Flashcards</p>
                  <p className="text-2xl font-bold text-[var(--foreground)]">{totalFlashcards}</p>
                  <p className="text-xs text-[var(--foreground-tertiary)]">
                    {totalFlashcards >= 50 ? 'Study master' : 'Keep going'}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="group bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-5 hover:border-[var(--border-hover)] hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                  <span className="text-2xl">
                    {totalNotes >= 20 ? '📝' : '✏️'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--foreground-secondary)] mb-1">Notes</p>
                  <p className="text-2xl font-bold text-[var(--foreground)]">{totalNotes}</p>
                  <p className="text-xs text-[var(--foreground-tertiary)]">
                    {totalNotes >= 20 ? 'Note taker' : 'Start writing'}
                  </p>
                </div>
              </div>
            </div>

            {/* Job Applications */}
            <div className="group bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-5 hover:border-[var(--border-hover)] hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                  <span className="text-2xl">
                    {totalJobs >= 10 ? '💼' : '📋'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--foreground-secondary)] mb-1">Job Apps</p>
                  <p className="text-2xl font-bold text-[var(--foreground)]">{totalJobs}</p>
                  <p className="text-xs text-[var(--foreground-tertiary)]">
                    {totalJobs >= 10 ? 'Job hunter' : 'Apply more'}
                  </p>
                </div>
              </div>
            </div>

            {/* Upcoming Exams */}
            <div className="group bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-5 hover:border-[var(--border-hover)] hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                  <span className="text-2xl">
                    {upcomingExams === 0 ? '✅' : '📚'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--foreground-secondary)] mb-1">Exams</p>
                  <p className="text-2xl font-bold text-[var(--foreground)]">{upcomingExams}</p>
                  <p className="text-xs text-[var(--foreground-tertiary)]">
                    {upcomingExams === 0 ? 'All clear' : 'Study time'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Gamification Widget */}
            <GamificationWidget />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Exams Overview */}
            <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Exams Overview</h3>
              {exams.length === 0 ? (
                <div className="text-center py-6">
                  <Clock className="w-12 h-12 text-[var(--foreground-tertiary)] mx-auto mb-3" />
                  <p className="text-[var(--foreground-secondary)] mb-3">No exams scheduled yet</p>
                  <button className="text-sm text-[var(--primary)] hover:underline">Add your first exam</button>
                </div>
              ) : (
                <div className="space-y-3">
                                   {exams
                   .filter(exam => !exam.completed)
                   .slice(0, 3)
                   .map((exam) => (
                     <div key={exam.id} className="flex items-center justify-between p-3 bg-[var(--background)] rounded-lg">
                       <div>
                         <p className="font-medium text-[var(--foreground)]">{exam.title}</p>
                         <p className="text-sm text-[var(--foreground-secondary)]">{exam.subject}</p>
                       </div>
                       <div className="text-right">
                         <p className="text-sm font-medium text-[var(--foreground)]">
                           {new Date(exam.date).toLocaleDateString()}
                         </p>
                         <p className="text-xs text-[var(--foreground-secondary)]">
                           {exam.completed ? 'Completed' : 'Upcoming'}
                         </p>
                       </div>
                     </div>
                   ))}
                 {exams.filter(exam => !exam.completed).length > 3 && (
                   <button className="w-full text-sm text-[var(--primary)] hover:underline py-2">
                     View all {exams.filter(exam => !exam.completed).length} exams
                   </button>
                 )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
