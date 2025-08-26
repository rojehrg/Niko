'use client';

import { useEffect, useState } from 'react';
import { Calendar, BookOpen, Briefcase, Target, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useFlashcardStore } from '@/lib/stores/flashcard-store';
import { useNotesStore } from '@/lib/stores/notes-store';
import { useJobsStore } from '@/lib/stores/jobs-store';
import { useExamsStore } from '@/lib/stores/exams-store';
import { useEventStore } from '@/lib/stores/event-store';
import { GamificationWidget } from '@/components/ui/gamification-widget';

export default function DashboardPage() {
  const { flashcards, fetchFlashcards } = useFlashcardStore();
  const { notes, fetchNotes } = useNotesStore();
  const { jobs, fetchJobs } = useJobsStore();
  const { exams, fetchExams } = useExamsStore();
  const { events, fetchEvents } = useEventStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchFlashcards(),
          fetchNotes(),
          fetchJobs(),
          fetchExams(),
          fetchEvents()
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchFlashcards, fetchNotes, fetchJobs, fetchExams, fetchEvents]);

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
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.eventDate);
    const today = new Date();
    return eventDate >= today;
  }).length;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">
            Welcome back, Niko! 👋
          </h1>
          <p className="text-lg text-[var(--foreground-secondary)]">
            Here's what's happening with your studies today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Flashcards */}
          <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--foreground-secondary)]">Flashcards</p>
                <p className="text-2xl font-bold text-[var(--foreground)]">{totalFlashcards}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {totalFlashcards >= 50 ? '📚' : '📖'}
                </div>
                <div className="text-xs text-[var(--foreground-secondary)] font-medium">
                  {totalFlashcards >= 50 ? 'Study master' : 'Keep going'}
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--foreground-secondary)]">Notes</p>
                <p className="text-2xl font-bold text-[var(--foreground)]">{totalNotes}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {totalNotes >= 20 ? '📝' : '✏️'}
                </div>
                <div className="text-xs text-[var(--foreground-secondary)] font-medium">
                  {totalNotes >= 20 ? 'Note taker' : 'Start writing'}
                </div>
              </div>
            </div>
          </div>

          {/* Job Applications */}
          <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--foreground-secondary)]">Job Apps</p>
                <p className="text-2xl font-bold text-[var(--foreground)]">{totalJobs}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {totalJobs >= 10 ? '💼' : '📋'}
                </div>
                <div className="text-xs text-[var(--foreground-secondary)] font-medium">
                  {totalJobs >= 10 ? 'Job hunter' : 'Apply more'}
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Exams */}
          <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--foreground-secondary)]">Exams</p>
                <p className="text-2xl font-bold text-[var(--foreground)]">{upcomingExams}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {upcomingExams === 0 ? '✅' : '📚'}
                </div>
                <div className="text-xs text-[var(--foreground-secondary)] font-medium">
                  {upcomingExams === 0 ? 'All clear' : 'Study time'}
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--foreground-secondary)]">Events</p>
                <p className="text-2xl font-bold text-[var(--foreground)]">{upcomingEvents}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                  {upcomingEvents === 0 ? '🎉' : '📅'}
                </div>
                <div className="text-xs text-[var(--foreground-secondary)] font-medium">
                  {upcomingEvents === 0 ? 'Free time' : 'Coming up'}
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
            
            {/* Quick Actions */}
            <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center gap-3 p-3 border border-[var(--border)] rounded-lg hover:bg-[var(--hover)] transition-colors">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium">Create Flashcard</span>
                </button>
                <button className="flex items-center gap-3 p-3 border border-[var(--border)] rounded-lg hover:bg-[var(--hover)] transition-colors">
                  <Target className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">Add Note</span>
                </button>
                <button className="flex items-center gap-3 p-3 border border-[var(--border)] rounded-lg hover:bg-[var(--hover)] transition-colors">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium">Track Job</span>
                </button>
                <button className="flex items-center gap-3 p-3 border border-[var(--border)] rounded-lg hover:bg-[var(--hover)] transition-colors">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium">Add Event</span>
                </button>
              </div>
            </div>
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

            {/* Recent Activity */}
            <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {totalFlashcards > 0 && (
                  <div className="flex items-center gap-3 p-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-[var(--foreground-secondary)]">
                      Created {totalFlashcards} flashcards
                    </span>
                  </div>
                )}
                {totalNotes > 0 && (
                  <div className="flex items-center gap-3 p-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-[var(--foreground-secondary)]">
                      Added {totalNotes} notes
                    </span>
                  </div>
                )}
                {totalJobs > 0 && (
                  <div className="flex items-center gap-3 p-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-[var(--foreground-secondary)]">
                      Applied to {totalJobs} jobs
                    </span>
                  </div>
                )}
                {upcomingExams > 0 && (
                  <div className="flex items-center gap-3 p-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-[var(--foreground-secondary)]">
                      {upcomingExams} exams coming up
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
