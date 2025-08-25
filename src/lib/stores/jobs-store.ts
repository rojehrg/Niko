import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';

export interface Job {
  id: string;
  company: string;
  position: string;
  location: string;
  status: 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';
  notes?: string;
  url?: string;
}

interface JobsState {
  jobs: Job[];
  isLoading: boolean;
  addJob: (jobData: Omit<Job, 'id'>) => Promise<void>;
  updateJob: (id: string, updates: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  updateStatus: (id: string, status: Job['status']) => Promise<void>;
  getJobsByStatus: (status: Job['status']) => Job[];
  fetchJobs: () => Promise<void>;
  getStats: () => {
    total: number;
    saved: number;
    applied: number;
    interview: number;
    offer: number;
    rejected: number;
  };
}

export const useJobsStore = create<JobsState>((set, get) => ({
  jobs: [],
  isLoading: false,

  fetchJobs: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
        throw error;
      }

      const jobs = data?.map(job => ({
        id: job.id,
        company: job.company,
        position: job.position,
        location: job.location,
        status: job.status,
        notes: job.notes,
        url: job.url,
      })) || [];

      set({ jobs, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      set({ isLoading: false });
    }
  },

  addJob: async (jobData) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert([{
          company: jobData.company,
          position: jobData.position,
          location: jobData.location,
          status: jobData.status,
          notes: jobData.notes,
          url: jobData.url,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating job:', error);
        throw error;
      }

      const newJob: Job = {
        ...jobData,
        id: data.id,
      };

      set((state) => ({
        jobs: [newJob, ...state.jobs],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to add job:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateJob: async (id, updates) => {
    set({ isLoading: true });
    try {
      const updateData: Record<string, unknown> = {};
      
      if (updates.company !== undefined) updateData.company = updates.company;
      if (updates.position !== undefined) updateData.position = updates.position;
      if (updates.location !== undefined) updateData.location = updates.location;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.notes !== undefined) updateData.notes = updates.notes;
      if (updates.url !== undefined) updateData.url = updates.url;

      const { data, error } = await supabase
        .from('jobs')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating job:', error);
        throw error;
      }

      const updatedJob = {
        id: data.id,
        company: data.company,
        position: data.position,
        location: data.location,
        status: data.status,
        notes: data.notes,
        url: data.url,
      };

      set((state) => ({
        jobs: state.jobs.map((job) =>
          job.id === id ? updatedJob : job
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to update job:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  deleteJob: async (id) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting job:', error);
        throw error;
      }

      set((state) => ({
        jobs: state.jobs.filter((job) => job.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to delete job:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateStatus: async (id, status) => {
    await get().updateJob(id, { status });
  },



  getJobsByStatus: (status) => {
    return get().jobs.filter((job) => job.status === status);
  },

  getStats: () => {
    const jobs = get().jobs;
    return {
      total: jobs.length,
      saved: jobs.filter(job => job.status === 'saved').length,
      applied: jobs.filter(job => job.status === 'applied').length,
      interview: jobs.filter(job => job.status === 'interview').length,
      offer: jobs.filter(job => job.status === 'offer').length,
      rejected: jobs.filter(job => job.status === 'rejected').length,
    };
  },
}));
