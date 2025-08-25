"use client";

import { 
  BookOpen, 
  StickyNote, 
  Briefcase, 
  Home
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Flashcards", href: "/flashcards", icon: BookOpen },
  { name: "Notes", href: "/notes", icon: StickyNote },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
];

interface NavigationProps {
  isCollapsed?: boolean;
}

export function Navigation({ isCollapsed = false }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav className={`flex flex-col space-y-1 transition-all duration-500 ease-out
      ${isCollapsed ? 'px-1' : 'px-3'}`}>
      {navigation.map((item, index) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ease-out group hover-lift relative overflow-hidden",
              isActive
                ? "bg-[var(--selected)] text-[var(--primary)] border-r-2 border-[var(--primary)] animate-slide-in"
                : "text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--hover)]",
              isCollapsed && "justify-center px-1 py-3 mx-auto w-12"
            )}
            style={{ 
              animationDelay: `${index * 50}ms`,
              animationFillMode: 'both'
            }}
            title={isCollapsed ? item.name : undefined}
          >
            <item.icon 
              className={cn(
                "transition-all duration-200",
                isCollapsed ? "h-5 w-5" : "h-4 w-4",
                isActive 
                  ? "text-[var(--primary)] animate-bounce-gentle" 
                  : "text-[var(--foreground-tertiary)] group-hover:text-[var(--foreground-secondary)] group-hover:scale-110"
              )} 
            />
            {!isCollapsed && <span className="font-medium relative z-10">{item.name}</span>}
            
            {/* Hover effect background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/5 to-[var(--accent-purple)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        );
      })}
    </nav>
  );
}
