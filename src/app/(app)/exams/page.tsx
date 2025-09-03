'use client'

import { useState, useEffect } from 'react'
import { Plus, Calendar, Clock, Bell, Edit3, Trash2, AlertTriangle, BookOpen, GraduationCap, Search, Filter, MoreHorizontal, Star, Target, Zap } from 'lucide-react'
import { useExamsStore, Exam } from '@/lib/stores/exams-store'

export default function ExamsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingExam, setEditingExam] = useState<Exam | null>(null)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'overdue' | 'completed'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  
  const {
    exams,
    fetchExams,
    addExam,
    updateExam,
    deleteExam,
    toggleComplete
  } = useExamsStore()

  useEffect(() => {
    fetchExams()
  }, [fetchExams])

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (exam.description && exam.description.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const now = new Date()
    const examDate = new Date(exam.date)
    
    let matchesFilter = true
    switch (filter) {
      case 'upcoming':
        matchesFilter = examDate > now && !exam.completed
        break
      case 'overdue':
        matchesFilter = examDate < now && !exam.completed
        break
      case 'completed':
        matchesFilter = exam.completed
        break
    }
    
    return matchesSearch && matchesFilter
  })

  const sortedExams = filteredExams.sort((a: Exam, b: Exam) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  const getDaysUntil = (date: string) => {
    const now = new Date()
    const examDate = new Date(date)
    const diffTime = examDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return { text: `Overdue by ${Math.abs(diffDays)} days`, color: 'text-[var(--foreground)]', bg: 'bg-red-50/50 dark:bg-red-950/20' }
    if (diffDays === 0) return { text: 'Today!', color: 'text-[var(--foreground)]', bg: 'bg-orange-50/50 dark:bg-orange-950/20' }
    if (diffDays === 1) return { text: 'Tomorrow', color: 'text-[var(--foreground)]', bg: 'bg-yellow-50/50 dark:bg-yellow-950/20' }
    if (diffDays <= 7) return { text: `${diffDays} days`, color: 'text-[var(--foreground)]', bg: 'bg-blue-50/50 dark:bg-blue-950/20' }
    return { text: `${diffDays} days`, color: 'text-[var(--foreground-secondary)]', bg: 'bg-[var(--background-secondary)]' }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-[var(--foreground)] bg-red-50/50 dark:bg-red-950/20 border-[var(--border)]'
      case 'medium': return 'text-[var(--foreground)] bg-yellow-50/50 dark:bg-yellow-950/20 border-[var(--border)]'
      case 'low': return 'text-[var(--foreground)] bg-green-50/50 dark:bg-green-950/20 border-[var(--border)]'
      default: return 'text-[var(--foreground-secondary)] bg-[var(--background-secondary)] border-[var(--border)]'
    }
  }

  const getStatusIcon = (exam: Exam) => {
    if (exam.completed) return <img src="/sprites/check.png" alt="Completed" className="w-4 h-4" />
    
    const daysUntil = getDaysUntil(exam.date)
    if (daysUntil.text.includes('Overdue')) return <AlertTriangle className="w-4 h-4 text-[var(--foreground-secondary)]" />
    if (daysUntil.text.includes('Today') || daysUntil.text.includes('Tomorrow')) return <Bell className="w-4 h-4 text-[var(--foreground-secondary)]" />
    
    return <Calendar className="w-4 h-4 text-[var(--foreground-secondary)]" />
  }

  const stats = {
    total: exams.length,
    active: exams.filter((e: Exam) => !e.completed).length,
    upcoming: exams.filter((e: Exam) => {
      const daysUntil = getDaysUntil(e.date)
      return !e.completed && !daysUntil.text.includes('Overdue')
    }).length,
    overdue: exams.filter((e: Exam) => {
      const daysUntil = getDaysUntil(e.date)
      return !e.completed && daysUntil.text.includes('Overdue')
    }).length,
    completed: exams.filter((e: Exam) => e.completed).length
  }

  return (
    <div className="min-h-screen py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight mb-2">
          Deadlines
        </h1>
        <p className="text-lg text-[var(--foreground-secondary)] font-medium">
          Track your academic deadlines and stay organized
        </p>
      </div>

      {/* Controls Section */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--foreground-tertiary)]" />
            <input
              type="text"
              placeholder="Search deadlines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-150 text-sm"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All', count: stats.total },
              { key: 'upcoming', label: 'Upcoming', count: stats.upcoming },
              { key: 'overdue', label: 'Overdue', count: stats.overdue },
              { key: 'completed', label: 'Completed', count: stats.completed }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                  filter === key
                    ? 'bg-[var(--background-secondary)] text-[var(--foreground)] border border-[var(--border)]'
                    : 'bg-transparent text-[var(--foreground-secondary)] hover:bg-[var(--hover)]'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">


          {/* Add New Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[var(--background-secondary)] hover:bg-[var(--hover)] text-[var(--foreground)] border border-[var(--border)] px-4 py-2 h-10 rounded-md text-sm font-medium transition-all duration-150 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {sortedExams.length === 0 ? (
          <div className="text-center py-16">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              Add Your First Deadline
            </button>
          </div>
        ) : (
          <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              {/* Notion-style Table */}
              <table className="w-full min-w-[1200px]">
                <thead>
                  <tr className="bg-[var(--background-secondary)] border-b border-[var(--border)]">
                    <th className="text-left py-3 px-4 text-sm font-medium text-[var(--foreground-secondary)] w-[200px]">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Title
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[var(--foreground-secondary)] w-[150px]">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        Subject
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[var(--foreground-secondary)] w-[120px]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[var(--foreground-secondary)] w-[120px]">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Status
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[var(--foreground-secondary)] w-[120px]">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Priority
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[var(--foreground-secondary)] w-[120px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedExams.map((exam) => (
                    <tr key={exam.id} className="border-b border-[var(--border)] hover:bg-[var(--hover)] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-medium text-[var(--foreground)]">{exam.title}</div>
                        {exam.description && (
                          <div className="text-sm text-[var(--foreground-secondary)] mt-1 line-clamp-1">
                            {exam.description}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-[var(--foreground)]">{exam.subject}</div>
                        {exam.location && (
                          <div className="text-sm text-[var(--foreground-secondary)] mt-1">
                            {exam.location}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-[var(--foreground)]">
                          {new Date(exam.date).toLocaleDateString()}
                        </div>
                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium mt-1 ${getDaysUntil(exam.date).bg}`}>
                          <Clock className="w-3 h-3" />
                          <span className={getDaysUntil(exam.date).color}>{getDaysUntil(exam.date).text}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          exam.completed 
                            ? 'text-[var(--foreground)] bg-green-50/50 dark:bg-green-950/20 border-[var(--border)]'
                            : 'text-[var(--foreground)] bg-blue-50/50 dark:bg-blue-950/20 border-[var(--border)]'
                        }`}>
                          {exam.completed ? 'Completed' : 'Active'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(exam.priority)}`}>
                          {exam.priority.charAt(0).toUpperCase() + exam.priority.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {!exam.completed && (
                            <button
                              onClick={() => setEditingExam(exam)}
                              className="p-1 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--hover)] rounded transition-colors"
                              title="Edit"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => toggleComplete(exam.id)}
                            className={`p-1 rounded transition-colors ${
                              exam.completed
                                ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                                : 'text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--hover)]'
                            }`}
                            title={exam.completed ? 'Mark incomplete' : 'Mark complete'}
                          >
                            <img 
                              src="/sprites/check.png" 
                              alt="Toggle Complete" 
                              className="w-4 h-4"
                            />
                          </button>
                          <button
                            onClick={() => deleteExam(exam.id)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-200 dark:hover:bg-red-900/20 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(isAddModalOpen || editingExam) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--background)] rounded-2xl shadow-2xl border border-[var(--border)] w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[var(--foreground)]">
                  {editingExam ? 'Edit Exam/Deadline' : 'Add New Exam/Deadline'}
                </h3>
              </div>
              
              <ExamForm
                exam={editingExam}
                onSubmit={async (examData) => {
                  if (editingExam) {
                    await updateExam(editingExam.id, examData)
                    setEditingExam(null)
                  } else {
                    await addExam(examData)
                    setIsAddModalOpen(false)
                  }
                }}
                onCancel={() => {
                  setIsAddModalOpen(false)
                  setEditingExam(null)
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Exam Form Component
function ExamForm({ exam, onSubmit, onCancel }: {
  exam?: any
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: exam?.title || '',
    description: exam?.description || '',
    subject: exam?.subject || '',
    date: exam?.date ? new Date(exam.date).toISOString().split('T')[0] : '',
    time: exam?.time || '',
    location: exam?.location || '',
    priority: exam?.priority || 'medium'
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await onSubmit({
        ...formData,
        date: new Date(formData.date + 'T' + (formData.time || '00:00')).toISOString()
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
          Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Final Exam, Assignment Due"
          className="w-full px-3 py-2.5 bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Additional details, requirements, or notes..."
          rows={3}
          className="w-full px-3 py-2.5 bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200 resize-none"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Subject *
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="e.g., Math, Biology"
            className="w-full px-3 py-2.5 bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Priority
          </label>
          <div className="relative">
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3 py-2.5 pr-10 bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200 appearance-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Date *
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2.5 pr-10 bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200 [&::-webkit-calendar-picker-indicator]:opacity-0"
              required
            />
            <button
              type="button"
              onClick={() => {
                const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
                if (dateInput && 'showPicker' in dateInput) {
                  dateInput.showPicker();
                }
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white hover:text-[var(--primary)] transition-colors cursor-pointer"
            >
              <Calendar className="w-full h-full" />
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Time
          </label>
          <div className="relative">
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-3 py-2.5 pr-10 bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200 [&::-webkit-calendar-picker-indicator]:opacity-0"
            />
            <button
              type="button"
              onClick={() => {
                const timeInput = document.querySelector('input[type="time"]') as HTMLInputElement;
                if (timeInput && 'showPicker' in timeInput) {
                  timeInput.showPicker();
                }
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white hover:text-[var(--primary)] transition-colors cursor-pointer"
            >
              <Clock className="w-full h-full" />
            </button>
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
          Location
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="e.g., Room 101, Online, Library"
          className="w-full px-3 py-2.5 bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200"
        />
      </div>
      

      
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 px-4 rounded-lg transition-all duration-200 font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-2.5 px-4 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
        >
          {isLoading ? 'Saving...' : (exam ? 'Update' : 'Create')}
        </button>
      </div>
    </form>
  )
}
