"use client";

import { Navigation } from "@/components/ui/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { FloatingEmojis } from "@/components/ui/floating-emojis";
import { BunnyEnvironment } from "@/components/ui/bunny-environment";
import { useState, useEffect } from "react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Beautiful Hover-based Sidebar */}
      <div 
        className="fixed left-0 top-0 h-full bg-[var(--background-secondary)] border-r border-[var(--border)] transition-all duration-300 ease-out z-50 group/sidebar"
        style={{ width: isSidebarCollapsed ? '64px' : '240px' }}
        onMouseEnter={() => setIsSidebarCollapsed(false)}
        onMouseLeave={() => setIsSidebarCollapsed(true)}
      >
        <Navigation isCollapsed={isSidebarCollapsed} />
      </div>

      {/* Main Content */}
      <div 
        className="min-h-screen transition-all duration-300 ease-out"
        style={{ marginLeft: isSidebarCollapsed ? '64px' : '240px' }}
      >
        {children}
      </div>

      {/* Floating Emojis */}
      <FloatingEmojis />
      
      {/* Bunny Environment */}
      <BunnyEnvironment />
    </div>
  );
}
