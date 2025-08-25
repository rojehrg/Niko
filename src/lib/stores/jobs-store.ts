import { create } from 'zustand';

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
  addJob: (job: Omit<Job, 'id' | 'lastUpdated'>) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  updateStatus: (id: string, status: Job['status']) => void;
  toggleFavorite: (id: string) => void;
  getJobsByStatus: (status: Job['status']) => Job[];
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

  addJob: (jobData) => {
    const newJob: Job = {
      ...jobData,
      id: crypto.randomUUID(),
      lastUpdated: new Date(),
    };
    set((state) => ({
      jobs: [...state.jobs, newJob],
    }));
  },

  updateJob: (id, updates) => {
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === id
          ? { ...job, ...updates, lastUpdated: new Date() }
          : job
      ),
    }));
  },

  deleteJob: (id) => {
    set((state) => ({
      jobs: state.jobs.filter((job) => job.id !== id),
    }));
  },

  updateStatus: (id, status) => {
    get().updateJob(id, { status });
  },

  toggleFavorite: (id) => {
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === id
          ? { ...job, isFavorite: !job.isFavorite, lastUpdated: new Date() }
          : job
      ),
    }));
  },

  getJobsByStatus: (status) => {
    return get().jobs.filter((job) => job.status === status);
  },

  getStats: () => {
    const jobs = get().jobs;
    return {
      total: jobs.length,
      saved: jobs.filter((j) => j.status === 'saved').length,
      applied: jobs.filter((j) => j.status === 'applied').length,
      screen: jobs.filter((j) => j.status === 'screen').length,
      interview: jobs.filter((j) => j.status === 'interview').length,
      offer: jobs.filter((j) => j.status === 'offer').length,
      rejected: jobs.filter((j) => j.status === 'rejected').length,
      withdrawn: jobs.filter((j) => j.status === 'withdrawn').length,
    };
  },
}));
