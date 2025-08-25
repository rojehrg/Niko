"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = savedTheme === "dark" || (!savedTheme && systemDark);
    
    setIsDark(initialDark);
    document.documentElement.setAttribute("data-theme", initialDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.setAttribute("data-theme", newIsDark ? "dark" : "light");
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--hover)] hover:bg-[var(--active)] transition-all duration-200 hover-scale animate-fade-in group"
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative">
        {isDark ? (
          <Sun className="h-4 w-4 text-[var(--foreground-secondary)] group-hover:text-yellow-500 transition-colors duration-200 group-hover:rotate-90" />
        ) : (
          <Moon className="h-4 w-4 text-[var(--foreground-secondary)] group-hover:text-blue-400 transition-colors duration-200 group-hover:rotate-12" />
        )}
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
      </div>
    </button>
  );
}
