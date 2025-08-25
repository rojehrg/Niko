import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';

export interface Job {
  id: string;
  company: string;
  position: string;
  location: string;
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  status: 'saved' | 'applied' | 'screen' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
  savedDate?: Date;
  appliedDate?: Date;
  screenDate?: Date;
  interviewDate?: Date;
  offerDate?: Date;
  lastUpdated: Date;
  salary?: string;
  salaryMin?: number;
  salaryMax?: number;
  notes?: string;
  url?: string;
  applicationUrl?: string;
  contactPerson?: string;
  contactEmail?: string;
  tags: string[];
  isFavorite: boolean;
}

interface JobsState {
  jobs: Job[];
  isLoading: boolean;
  addJob: (job: Omit<Job, 'id' | 'lastUpdated'>) => Promise<void>;
  updateJob: (id: string, updates: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  updateStatus: (id: string, status: Job['status']) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  getJobsByStatus: (status: Job['status']) => Job[];
  fetchJobs: () => Promise<void>;
  getStats: () => {
    total: number;
    saved: number;
    applied: number;
    screen: number;
    interview: number;
    offer: number;
    rejected: number;
    withdrawn: number;
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
        .order('last_updated', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
        throw error;
      }

      const jobs = data?.map(job => ({
        id: job.id,
        company: job.company,
        position: job.position,
        location: job.location,
        jobType: job.job_type,
        status: job.status,
        savedDate: job.saved_date ? new Date(job.saved_date) : undefined,
        appliedDate: job.applied_date ? new Date(job.applied_date) : undefined,
        screenDate: job.screen_date ? new Date(job.screen_date) : undefined,
        interviewDate: job.interview_date ? new Date(job.interview_date) : undefined,
        offerDate: job.offer_date ? new Date(job.offer_date) : undefined,
        lastUpdated: new Date(job.last_updated),
        salary: job.salary,
        salaryMin: job.salary_min,
        salaryMax: job.salary_max,
        notes: job.notes,
        url: job.url,
        applicationUrl: job.application_url,
        contactPerson: job.contact_person,
        contactEmail: job.contact_email,
        tags: job.tags || [],
        isFavorite: job.is_favorite || false,
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
          job_type: jobData.jobType,
          status: jobData.status,
          saved_date: jobData.savedDate,
          applied_date: jobData.appliedDate,
          screen_date: jobData.screenDate,
          interview_date: jobData.interviewDate,
          offer_date: jobData.offerDate,
          salary: jobData.salary,
          salary_min: jobData.salaryMin,
          salary_max: jobData.salaryMax,
          notes: jobData.notes,
          url: jobData.url,
          application_url: jobData.applicationUrl,
          contact_person: jobData.contactPerson,
          contact_email: jobData.contactEmail,
          tags: jobData.tags,
          is_favorite: jobData.isFavorite,
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
        lastUpdated: new Date(data.last_updated),
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
      if (updates.jobType !== undefined) updateData.job_type = updates.jobType;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.savedDate !== undefined) updateData.saved_date = updates.savedDate;
      if (updates.appliedDate !== undefined) updateData.applied_date = updates.appliedDate;
      if (updates.screenDate !== undefined) updateData.screen_date = updates.screenDate;
      if (updates.interviewDate !== undefined) updateData.interview_date = updates.interviewDate;
      if (updates.offerDate !== undefined) updateData.offer_date = updates.offerDate;
      if (updates.salary !== undefined) updateData.salary = updates.salary;
      if (updates.salaryMin !== undefined) updateData.salary_min = updates.salaryMin;
      if (updates.salaryMax !== undefined) updateData.salary_max = updates.salaryMax;
      if (updates.notes !== undefined) updateData.notes = updates.notes;
      if (updates.url !== undefined) updateData.url = updates.url;
      if (updates.applicationUrl !== undefined) updateData.application_url = updates.applicationUrl;
      if (updates.contactPerson !== undefined) updateData.contact_person = updates.contactPerson;
      if (updates.contactEmail !== undefined) updateData.contact_email = updates.contactEmail;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.isFavorite !== undefined) updateData.is_favorite = updates.isFavorite;

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
        jobType: data.job_type,
        status: data.status,
        savedDate: data.saved_date ? new Date(data.saved_date) : undefined,
        appliedDate: data.applied_date ? new Date(data.applied_date) : undefined,
        screenDate: data.screen_date ? new Date(data.screen_date) : undefined,
        interviewDate: data.interview_date ? new Date(data.interview_date) : undefined,
        offerDate: data.offer_date ? new Date(data.offer_date) : undefined,
        lastUpdated: new Date(data.last_updated),
        salary: data.salary,
        salaryMin: data.salary_min,
        salaryMax: data.salary_max,
        notes: data.notes,
        url: data.url,
        applicationUrl: data.application_url,
        contactPerson: data.contact_person,
        contactEmail: data.contact_email,
        tags: data.tags || [],
        isFavorite: data.is_favorite || false,
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

  toggleFavorite: async (id) => {
    set({ isLoading: true });
    try {
      const currentJob = get().jobs.find(job => job.id === id);
      if (!currentJob) throw new Error('Job not found');

      const { data, error } = await supabase
        .from('jobs')
        .update({ is_favorite: !currentJob.isFavorite })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error toggling favorite:', error);
        throw error;
      }

      const updatedJob = {
        ...currentJob,
        isFavorite: data.is_favorite,
        lastUpdated: new Date(data.last_updated),
      };

      set((state) => ({
        jobs: state.jobs.map((job) =>
          job.id === id ? updatedJob : job
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      set({ isLoading: false });
      throw error;
    }
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
      screen: jobs.filter(job => job.status === 'screen').length,
      interview: jobs.filter(job => job.status === 'interview').length,
      offer: jobs.filter(job => job.status === 'offer').length,
      rejected: jobs.filter(job => job.status === 'rejected').length,
      withdrawn: jobs.filter(job => job.status === 'withdrawn').length,
    };
  },
}));
