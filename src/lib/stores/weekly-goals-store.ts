import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface WeeklyGoal {
  id: string;
  user_id: string;
  text: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface WeeklyGoalInput {
  text: string;
  completed?: boolean;
}

interface WeeklyGoalsStore {
  goals: WeeklyGoal[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchGoals: () => Promise<void>;
  addGoal: (goal: WeeklyGoalInput) => Promise<void>;
  updateGoal: (id: string, updates: Partial<WeeklyGoalInput>) => Promise<void>;
  removeGoal: (id: string) => Promise<void>;
  toggleGoal: (id: string) => Promise<void>;
  
  // Computed
  getCompletedGoals: () => WeeklyGoal[];
  getTotalGoals: () => number;
}

export const useWeeklyGoalsStore = create<WeeklyGoalsStore>((set, get) => ({
  goals: [],
  isLoading: false,
  error: null,

  fetchGoals: async () => {
    // Don't fetch if already loading or if we have goals
    if (get().isLoading || get().goals.length > 0) return;
    
    // Only show loading if we actually don't have any goals
    const shouldShowLoading = get().goals.length === 0;
    if (shouldShowLoading) {
      set({ isLoading: true, error: null });
    }
    
    try {
      const { data, error } = await supabase
        .from('weekly_goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      set({ goals: data || [] });
    } catch (error) {
      console.error('Error fetching weekly goals:', error);
      set({ error: 'Failed to fetch weekly goals' });
    } finally {
      if (shouldShowLoading) {
        set({ isLoading: false });
      }
    }
  },

  addGoal: async (goalInput: WeeklyGoalInput) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('weekly_goals')
        .insert([{
          ...goalInput,
          user_id: '00000000-0000-0000-0000-000000000000', // Fixed UUID for single-user setup
          completed: goalInput.completed || false
        }])
        .select()
        .single();

      if (error) throw error;
      
      set(state => ({
        goals: [data, ...state.goals]
      }));
    } catch (error) {
      console.error('Error adding weekly goal:', error);
      set({ error: 'Failed to add weekly goal' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateGoal: async (id: string, updates: Partial<WeeklyGoalInput>) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('weekly_goals')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      set(state => ({
        goals: state.goals.map(goal => 
          goal.id === id ? data : goal
        )
      }));
    } catch (error) {
      console.error('Error updating weekly goal:', error);
      set({ error: 'Failed to update weekly goal' });
    } finally {
      set({ isLoading: false });
    }
  },

  removeGoal: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const { error } = await supabase
        .from('weekly_goals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      set(state => ({
        goals: state.goals.filter(goal => goal.id !== id)
      }));
    } catch (error) {
      console.error('Error removing weekly goal:', error);
      set({ error: 'Failed to remove weekly goal' });
    } finally {
      set({ isLoading: false });
    }
  },

  toggleGoal: async (id: string) => {
    const goal = get().goals.find(g => g.id === id);
    if (!goal) return;
    
    // Optimistically update the UI first
    set(state => ({
      goals: state.goals.map(g => 
        g.id === id ? { ...g, completed: !g.completed } : g
      )
    }));
    
    try {
      // Then update in Supabase without triggering loading state
      const { error } = await supabase
        .from('weekly_goals')
        .update({
          completed: !goal.completed,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error toggling weekly goal:', error);
      // Revert the optimistic update on error
      set(state => ({
        goals: state.goals.map(g => 
          g.id === id ? { ...g, completed: goal.completed } : g
        )
      }));
      set({ error: 'Failed to toggle weekly goal' });
    }
  },

  getCompletedGoals: () => {
    return get().goals.filter(goal => goal.completed);
  },

  getTotalGoals: () => {
    return get().goals.length;
  }
}));
