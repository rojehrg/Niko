'use client'

import { useState } from 'react'
import { Trophy, Target, Plus, X, CheckCircle } from 'lucide-react'

interface Goal {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

export function GamificationWidget() {
  const [goals, setGoals] = useState<Goal[]>([])

  const [isAddingGoal, setIsAddingGoal] = useState(false)
  const [newGoalText, setNewGoalText] = useState('')

  const toggleGoal = (goalId: string) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    ))
  }

  const addGoal = () => {
    if (newGoalText.trim()) {
      const newGoal: Goal = {
        id: Date.now().toString(),
        text: newGoalText.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      }
      setGoals(prev => [...prev, newGoal])
      setNewGoalText('')
      setIsAddingGoal(false)
    }
  }

  const removeGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId))
  }

  const completedGoals = goals.filter(goal => goal.completed).length
  const totalGoals = goals.length

  return (
    <div className="bg-[var(--background-secondary)] rounded-xl border border-[var(--border)] p-6">
      {/* Simple Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Weekly Goals</h3>
        </div>
        <button
          onClick={() => setIsAddingGoal(!isAddingGoal)}
          className="p-1.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

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
              className="p-1 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setIsAddingGoal(false)
                setNewGoalText('')
              }}
              className="p-1 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
            >
              <X className="w-4 h-4" />
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
              className={`flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                goal.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-[var(--border)] hover:border-[var(--primary)]'
              }`}
            >
              {goal.completed && <CheckCircle className="w-3 h-3" />}
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
              className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-all duration-200"
            >
              <X className="w-3 h-3" />
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
