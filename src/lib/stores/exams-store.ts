import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export interface Exam {
  id: string
  title: string
  description?: string
  subject: string
  date: string
  time?: string
  location?: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface ExamInput {
  title: string
  description?: string
  subject: string
  date: string
  time?: string
  location?: string
  priority: 'low' | 'medium' | 'high'
}

interface ExamsStore {
  exams: Exam[]
  isLoading: boolean
  error: string | null
  fetchExams: () => Promise<void>
  addExam: (examData: ExamInput) => Promise<void>
  updateExam: (id: string, updates: Partial<ExamInput>) => Promise<void>
  deleteExam: (id: string) => Promise<void>
  toggleComplete: (id: string) => Promise<void>
}

// Helper functions for local storage fallback
const getLocalExams = (): Exam[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem('niko-exams')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const setLocalExams = (exams: Exam[]) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('niko-exams', JSON.stringify(exams))
  } catch {
    // Ignore storage errors
  }
}

export const useExamsStore = create<ExamsStore>((set, get) => ({
  exams: getLocalExams(),
  isLoading: false,
  error: null,

  fetchExams: async () => {
    set({ isLoading: true, error: null })
    
    try {
      // Try to fetch from Supabase first
      if (supabase) {
        const { data, error } = await supabase
          .from('exams')
          .select('*')
          .order('date', { ascending: true })

        if (error) {
          // If table doesn't exist yet, just use local data
          if (error.message.includes('relation "exams" does not exist')) {
            console.log('Exams table not created yet - using local data');
            const localExams = getLocalExams()
            set({ exams: localExams, isLoading: false, error: null });
            return;
          }
          throw error;
        }

        // Convert Supabase data (snake_case) back to our format (camelCase)
        const convertedData = (data || []).map((exam: any) => ({
          id: exam.id,
          title: exam.title,
          description: exam.description,
          subject: exam.subject,
          date: exam.date,
          time: exam.time,
          location: exam.location,
          priority: exam.priority,
          completed: exam.completed,
          createdAt: exam.created_at,
          updatedAt: exam.updated_at
        }))

        // Update local storage with converted data
        setLocalExams(convertedData)
        set({ exams: convertedData, isLoading: false })
        return
      }
    } catch (error) {
      console.log('Supabase fetch failed - using local data:', error)
    }

    // Fallback to local data
    const localExams = getLocalExams()
    set({ exams: localExams, isLoading: false, error: null })
  },

  addExam: async (examData: ExamInput) => {
    set({ isLoading: true, error: null })
    
    try {
      const newExam: Exam = {
        id: Date.now().toString(),
        ...examData,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Try to save to Supabase
      if (supabase) {
        try {
          // Convert to Supabase format (snake_case)
          const supabaseExam = {
            title: newExam.title,
            description: newExam.description,
            subject: newExam.subject,
            date: newExam.date,
            time: newExam.time,
            location: newExam.location,
            priority: newExam.priority,
            completed: newExam.completed,
            created_at: newExam.createdAt,
            updated_at: newExam.updatedAt
          }

          const { data, error } = await supabase
            .from('exams')
            .insert([supabaseExam])
            .select()
            .single()

          if (error) throw error
          
          // Convert Supabase response back to our format and update local storage
          const convertedExam = {
            id: data.id,
            title: data.title,
            description: data.description,
            subject: data.subject,
            date: data.date,
            time: data.time,
            location: data.location,
            priority: data.priority,
            completed: data.completed,
            createdAt: data.created_at,
            updatedAt: data.updated_at
          }
          
          const currentExams = get().exams
          const updatedExams = [...currentExams, convertedExam]
          setLocalExams(updatedExams)
          set({ exams: updatedExams, isLoading: false })
          return
        } catch (supabaseError) {
          console.log('Supabase save failed - using local storage:', supabaseError)
        }
      }

      // Fallback to local storage
      const currentExams = get().exams
      const updatedExams = [...currentExams, newExam]
      setLocalExams(updatedExams)
      set({ exams: updatedExams, isLoading: false })
    } catch (error) {
      console.error('Failed to add exam:', error)
      set({ error: 'Failed to add exam', isLoading: false })
    }
  },

  updateExam: async (id: string, updates: Partial<ExamInput>) => {
    set({ isLoading: true, error: null })
    
    try {
      const currentExams = get().exams
      const updatedExams = currentExams.map(exam => 
        exam.id === id ? { ...exam, ...updates, updatedAt: new Date().toISOString() } : exam
      )

      // Try to update in Supabase
      if (supabase) {
        try {
          // Convert to Supabase format (snake_case)
          const supabaseUpdates: Record<string, unknown> = {}
          if (updates.title !== undefined) supabaseUpdates.title = updates.title
          if (updates.description !== undefined) supabaseUpdates.description = updates.description
          if (updates.subject !== undefined) supabaseUpdates.subject = updates.subject
          if (updates.date !== undefined) supabaseUpdates.date = updates.date
          if (updates.time !== undefined) supabaseUpdates.time = updates.time
          if (updates.location !== undefined) supabaseUpdates.location = updates.location
          if (updates.priority !== undefined) supabaseUpdates.priority = updates.priority
          supabaseUpdates.updated_at = new Date().toISOString()

          const { error } = await supabase
            .from('exams')
            .update(supabaseUpdates)
            .eq('id', id)

          if (error) throw error
        } catch (supabaseError) {
          console.log('Supabase update failed - using local storage:', supabaseError)
        }
      }

      // Update local storage
      setLocalExams(updatedExams)
      set({ exams: updatedExams, isLoading: false })
    } catch (error) {
      console.error('Failed to update exam:', error)
      set({ error: 'Failed to update exam', isLoading: false })
    }
  },

  deleteExam: async (id: string) => {
    set({ isLoading: true, error: null })
    
    try {
      const currentExams = get().exams
      const updatedExams = currentExams.filter(exam => exam.id !== id)

      // Try to delete from Supabase
      if (supabase) {
        try {
          const { error } = await supabase
            .from('exams')
            .delete()
            .eq('id', id)

          if (error) throw error
        } catch (supabaseError) {
          console.log('Supabase delete failed - using local storage:', supabaseError)
        }
      }

      // Update local storage
      setLocalExams(updatedExams)
      set({ exams: updatedExams, isLoading: false })
    } catch (error) {
      console.error('Failed to delete exam:', error)
      set({ error: 'Failed to delete exam', isLoading: false })
    }
  },

  toggleComplete: async (id: string) => {
    const currentExams = get().exams
    const updatedExams = currentExams.map(exam => 
      exam.id === id ? { ...exam, completed: !exam.completed, updatedAt: new Date().toISOString() } : exam
    )

    // Try to update in Supabase
    if (supabase) {
      try {
        await supabase
          .from('exams')
          .update({ completed: !currentExams.find(e => e.id === id)?.completed, updatedAt: new Date().toISOString() })
          .eq('id', id)
      } catch (error) {
        console.log('Supabase toggle failed - using local storage:', error)
      }
    }

    // Update local storage
    setLocalExams(updatedExams)
    set({ exams: updatedExams })
  },

  sendReminder: async (id: string) => {
    // This would normally send an SMS reminder
    // For now, just log it
    console.log('Sending reminder for exam:', id)
  }
}))
