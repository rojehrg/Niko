"use client";

import { 
  BookOpen, 
  StickyNote, 
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
  { name: "Notes", href: "/notes", icon: StickyNote },
  { name: "Exams", href: "/exams", icon: Calendar },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
];

interface NavigationProps {
  isCollapsed?: boolean;
}

export function Navigation({ isCollapsed = false }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col space-y-1 px-3 py-4">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ease-out relative",
              isActive
                ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                : "text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--hover)]"
            )}
            title={isCollapsed ? item.name : undefined}
          >
            {/* Icon container - fixed size to prevent snapping */}
            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
              <item.icon 
                className={cn(
                  "w-5 h-5 transition-colors duration-200",
                  isActive 
                    ? "text-[var(--primary)]" 
                    : "text-[var(--foreground-tertiary)] group-hover:text-[var(--foreground-secondary)]"
                )} 
              />
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
