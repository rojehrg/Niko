import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WelcomeState {
  hasSeenWelcome: boolean;
  setHasSeenWelcome: (seen: boolean) => void;
  resetToWelcome: () => void;
}

export const useWelcomeStore = create<WelcomeState>()(
  persist(
    (set) => ({
      hasSeenWelcome: false,
      setHasSeenWelcome: (seen) => set({ hasSeenWelcome: seen }),
      resetToWelcome: () => set({ hasSeenWelcome: false }),
    }),
    {
      name: 'niko-welcome-storage',
    }
  )
);
