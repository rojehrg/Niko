"use client";

import {
  BookOpen,
  Briefcase,
  Home,
  Calendar
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Flashcards", href: "/flashcards", icon: BookOpen },
  { name: "Deadlines", href: "/exams", icon: Calendar },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "Labels", href: "/diagram-labeling", icon: null },
];

interface NavigationProps {
  isCollapsed?: boolean;
}

export function Navigation({ isCollapsed = false }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav className={cn(
      "flex flex-col space-y-1 py-4",
      isCollapsed ? "px-2" : "px-3"
    )}>
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 py-2 rounded-md text-sm font-medium transition-all duration-150 ease-out relative",
              isCollapsed ? "px-2 justify-center" : "px-3",
              isActive
                ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                : "text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--hover)]"
            )}
            title={isCollapsed ? item.name : undefined}
          >
            {/* Icon container - fixed size to prevent snapping */}
            <div className={cn(
              "flex items-center justify-center flex-shrink-0",
              isCollapsed ? "w-12 h-12" : "w-10 h-10"
            )}>
              {item.name === "Dashboard" ? (
                <img 
                  src="/sprites/dashboard.png" 
                  alt="Dashboard" 
                  className={cn(
                    isCollapsed ? "w-12 h-12" : "w-8 h-8",
                    "transition-all duration-200",
                    isActive && "brightness-125"
                  )}
                />
              ) : item.name === "Flashcards" ? (
                <img 
                  src="/sprites/flashcards.png" 
                  alt="Flashcards" 
                  className={cn(
                    isCollapsed ? "w-12 h-12" : "w-8 h-8",
                    "transition-all duration-200",
                    isActive && "brightness-125"
                  )}
                />
              ) : item.name === "Deadlines" ? (
                <img 
                  src="/sprites/exam.png" 
                  alt="Deadlines" 
                  className={cn(
                    isCollapsed ? "w-12 h-12" : "w-8 h-8",
                    "transition-all duration-200",
                    isActive && "brightness-125"
                  )}
                />
              ) : item.name === "Jobs" ? (
                <img 
                  src="/sprites/jobs.png" 
                  alt="Jobs" 
                  className={cn(
                    isCollapsed ? "w-12 h-12" : "w-8 h-8",
                    "transition-all duration-200",
                    isActive && "brightness-125"
                  )}
                />
              ) : item.name === "Labels" ? (
                <img 
                  src="/sprites/labels.png" 
                  alt="Labels" 
                  className={cn(
                    isCollapsed ? "w-12 h-12" : "w-8 h-8",
                    "object-contain transition-all duration-200",
                    isActive && "brightness-125"
                  )}
                />
              ) : (
                item.icon && <item.icon 
                  className={cn(
                    isCollapsed ? "w-12 h-12" : "w-8 h-8",
                    "transition-colors duration-200",
                    isActive 
                      ? "text-[var(--primary)]" 
                      : "text-[var(--foreground-tertiary)] group-hover:text-[var(--foreground-secondary)]"
                  )} 
                />
              )}
            </div>
            
            {/* Text - only show when not collapsed */}
            {!isCollapsed && (
              <span className="font-medium transition-opacity duration-200">
                {item.name}
              </span>
            )}
            
            {/* Active indicator */}
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--primary)] rounded-r-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
