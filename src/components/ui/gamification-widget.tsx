'use client'

import { useState, useEffect } from 'react'
import { Trophy, Target, Plus } from 'lucide-react'
import { useWeeklyGoalsStore, WeeklyGoal } from '@/lib/stores/weekly-goals-store'

export function GamificationWidget() {
  const { 
    goals, 
    isLoading, 
    error, 
    fetchGoals, 
    addGoal: addGoalToStore, 
    removeGoal: removeGoalFromStore, 
 
    toggleGoal: toggleGoalInStore 
  } = useWeeklyGoalsStore()

  const [isAddingGoal, setIsAddingGoal] = useState(false)
  const [newGoalText, setNewGoalText] = useState('')

  // Fetch goals from Supabase on component mount, but only if goals are empty
  useEffect(() => {
    if (goals.length === 0) {
      fetchGoals()
    }
  }, [fetchGoals, goals.length])

  const addGoal = async () => {
    if (newGoalText.trim()) {
      await addGoalToStore({ text: newGoalText.trim() })
      setNewGoalText('')
      setIsAddingGoal(false)
    }
  }

  const removeGoal = async (goalId: string) => {
    await removeGoalFromStore(goalId)
  }

  const toggleGoal = async (goalId: string) => {
    await toggleGoalInStore(goalId)
  }

  const completedGoals = goals.filter(goal => goal.completed).length
  const totalGoals = goals.length

  return (
    <div className="bg-[var(--background-secondary)] rounded-xl border border-[var(--border)] p-6">
      {/* Simple Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-28 h-28 flex items-center justify-center">
            <img 
              src="/sprites/trophy.png" 
              alt="Trophy" 
              className="w-20 h-20"
            />
          </div>
          <h3 className="text-2xl font-semibold text-[var(--foreground)]">Weekly Goals</h3>
        </div>
        <button
          onClick={() => setIsAddingGoal(!isAddingGoal)}
          className="p-1.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Loading State - Only show during initial fetch */}


      {/* Add Goal Input */}
      {isAddingGoal && (
        <div className="mb-4 p-3 bg-[var(--background)] rounded-lg border border-[var(--border)]">
          <div className="flex gap-2">
            <input
              type="text"
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
              placeholder="Enter your goal..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--foreground)] placeholder-[var(--foreground-tertiary)]"
              onKeyPress={(e) => e.key === 'Enter' && addGoal()}
              autoFocus
            />
            <button
              onClick={addGoal}
              className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
            >
              <img 
                src="/sprites/check.png" 
                alt="Check" 
                className="w-5 h-5"
              />
            </button>
            <button
              onClick={() => {
                setIsAddingGoal(false)
                setNewGoalText('')
              }}
              className="p-1 text-red-500 hover:text-red-600 hover:bg-red-200 dark:hover:bg-red-900/20 rounded transition-colors"
            >
              <img 
                src="/sprites/x.png" 
                alt="Close" 
                className="w-5 h-5"
              />
            </button>
          </div>
        </div>
      )}

      {/* Goals List */}
      <div className="space-y-2">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className={`group flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
              goal.completed
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                : 'bg-[var(--background)] border-[var(--border)] hover:border-[var(--primary)]'
            }`}
          >
            <button
              onClick={() => toggleGoal(goal.id)}
              className="flex-shrink-0 transition-all duration-200 hover:scale-105"
            >
              {goal.completed ? (
                <img 
                  src="/sprites/check.png" 
                  alt="Check" 
                  className="w-5 h-5"
                />
              ) : (
                <div className="w-5 h-5 border-2 border-[var(--border)] hover:border-[var(--primary)] rounded transition-colors flex items-center justify-center" />
              )}
            </button>
            <span
              className={`flex-1 text-sm transition-all duration-200 ${
                goal.completed
                  ? 'text-green-700 dark:text-green-300 line-through'
                  : 'text-[var(--foreground)]'
              }`}
            >
              {goal.text}
            </span>
            <button
              onClick={() => removeGoal(goal.id)}
              className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-200 dark:hover:bg-red-900/20 rounded transition-all duration-200"
            >
              <img 
                src="/sprites/x.png" 
                alt="Delete" 
                className="w-5 h-5"
              />
            </button>
          </div>
        ))}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-4 text-[var(--foreground-tertiary)] text-sm">
          No goals set yet. Click the + button to add your first goal!
        </div>
      )}

      {/* Simple Progress */}
      <div className="mt-4 pt-4 border-t border-[var(--border)]">
        <div className="text-center">
          <div className="text-2xl font-bold text-[var(--foreground)] mb-1">
            {completedGoals}/{totalGoals}
          </div>
          <div className="text-sm text-[var(--foreground-secondary)]">Goals Completed</div>
        </div>
      </div>
    </div>
  )
}
