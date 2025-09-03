'use client';

import { useEffect, useState } from 'react';
import { Calendar, BookOpen, Briefcase, Target, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFlashcardStore } from '@/lib/stores/flashcard-store';

import { useJobsStore } from '@/lib/stores/jobs-store';
import { useExamsStore } from '@/lib/stores/exams-store';

import { GamificationWidget } from '@/components/ui/gamification-widget';

export default function DashboardPage() {
  const router = useRouter();
  const { flashcards, fetchFlashcards } = useFlashcardStore();

  const { jobs, fetchJobs } = useJobsStore();
  const { exams, fetchExams } = useExamsStore();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchFlashcards(),
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
  }, [fetchFlashcards, fetchJobs, fetchExams]);

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
  const totalJobs = jobs.length;
  const upcomingExams = exams.filter(exam => !exam.completed).length;
  
  // Get total labels from localStorage
  const totalLabels = (() => {
    if (typeof window !== 'undefined') {
      try {
        const storedDiagrams = localStorage.getItem('diagrams');
        if (storedDiagrams) {
          const diagrams = JSON.parse(storedDiagrams);
          return Array.isArray(diagrams) ? diagrams.length : 0;
        }
      } catch (error) {
        console.error('Error reading diagrams from localStorage:', error);
      }
    }
    return 0;
  })();


  return (
    <div className="min-h-screen py-8">
        {/* Welcome Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
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
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Quick Overview</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Flashcards */}
            <div 
              className="group bg-[var(--background-secondary)] border border-[var(--border)] rounded-md hover:border-[var(--border-hover)] transition-all duration-150 cursor-pointer p-3"
              onClick={() => router.push('/flashcards')}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-transform duration-150 mb-2">
                  <img 
                    src="/sprites/flashcards.png" 
                    alt="Flashcards" 
                    className="w-8 h-8"
                  />
                </div>
                <p className="text-xs font-medium text-[var(--foreground-secondary)] mb-1">Flashcards</p>
                <p className="text-xl font-bold text-[var(--foreground)] mb-1">{totalFlashcards}</p>
                <p className="text-xs text-[var(--foreground-tertiary)]">
                  {totalFlashcards >= 50 ? 'Study master' : 'Keep going'}
                </p>
              </div>
            </div>

            {/* Job Applications */}
            <div 
              className="group bg-[var(--background-secondary)] border border-[var(--border)] rounded-md hover:border-[var(--border-hover)] transition-all duration-150 cursor-pointer p-3"
              onClick={() => router.push('/jobs')}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-transform duration-150 mb-2">
                  <img 
                    src="/sprites/jobs.png" 
                    alt="Jobs" 
                    className="w-8 h-8"
                  />
                </div>
                <p className="text-xs font-medium text-[var(--foreground-secondary)] mb-1">Job Apps</p>
                <p className="text-xl font-bold text-[var(--foreground)] mb-1">{totalJobs}</p>
                <p className="text-xs text-[var(--foreground-tertiary)]">
                  {totalJobs >= 10 ? 'Job hunter' : 'Apply more'}
                </p>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div 
              className="group bg-[var(--background-secondary)] border border-[var(--border)] rounded-md hover:border-[var(--border-hover)] transition-all duration-150 cursor-pointer p-3"
              onClick={() => router.push('/exams')}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-transform duration-150 mb-2">
                  <img 
                    src="/sprites/exam.png" 
                    alt="Deadlines" 
                    className="w-8 h-8"
                  />
                </div>
                <p className="text-xs font-medium text-[var(--foreground-secondary)] mb-1">Deadlines</p>
                <p className="text-xl font-bold text-[var(--foreground)] mb-1">{upcomingExams}</p>
                <p className="text-xs text-[var(--foreground-tertiary)]">
                  {upcomingExams === 0 ? 'No deadlines to worry about' : 'Stay on track'}
                </p>
              </div>
            </div>

            {/* Labels */}
            <div 
              className="group bg-[var(--background-secondary)] border border-[var(--border)] rounded-md hover:border-[var(--border-hover)] transition-all duration-150 cursor-pointer p-3"
              onClick={() => router.push('/diagram-labeling')}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-transform duration-150 mb-2">
                  <img 
                    src="/sprites/labels.png" 
                    alt="Labels" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <p className="text-xs font-medium text-[var(--foreground-secondary)] mb-1">Labels</p>
                <p className="text-xl font-bold text-[var(--foreground)] mb-1">{totalLabels}</p>
                <p className="text-xs text-[var(--foreground-tertiary)]">
                  {totalLabels === 0 ? 'Create your first diagram' : 'Study diagrams'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Your Progress</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Gamification Widget */}
            <GamificationWidget />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-md p-4">
              <h3 className="text-base font-semibold text-[var(--foreground)] mb-3">Upcoming Deadlines</h3>
              {exams.length === 0 ? (
                <div className="text-center py-4">
                  <Clock className="w-8 h-8 text-[var(--foreground-tertiary)] mx-auto mb-2" />
                  <p className="text-[var(--foreground-secondary)] text-sm">No deadlines scheduled yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {exams
                    .filter(exam => !exam.completed)
                    .slice(0, 3)
                    .map((exam) => (
                      <div key={exam.id} className="flex items-center justify-between bg-[var(--background)] rounded-md p-3">
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
                    <button className="w-full text-sm text-[var(--primary)] hover:underline py-3 h-12">
                      View all {exams.filter(exam => !exam.completed).length} deadlines
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
