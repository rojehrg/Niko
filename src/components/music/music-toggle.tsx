"use client";

import { Music } from 'lucide-react';

interface MusicToggleProps {
  isVisible: boolean;
  onClick: () => void;
}

export function MusicToggle({ isVisible, onClick }: MusicToggleProps) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 hover:shadow-sm ${
        isVisible 
          ? 'bg-[var(--primary)] text-white' 
          : 'bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--hover)]'
      }`}
      title={isVisible ? "Hide music player" : "Show music player"}
    >
      <Music className="w-4 h-4" />
    </button>
  );
}
