"use client";

import { Navigation } from "@/components/ui/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { FloatingEmojis } from "@/components/ui/floating-emojis";

import { WelcomeScreen } from "@/components/welcome/welcome-screen";
import { useWelcomeStore } from "@/lib/stores/welcome-store";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import MusicToggle from "@/components/music/music-toggle";
import SpotifyPlayer from "@/components/music/spotify-player";

// Holiday Countdown Component
function HolidayCountdown({ 
  holiday, 
  onEdit, 
  onDelete 
}: { 
  holiday: { id: string; emoji: string; name: string; date: string; }; 
  onEdit: (holiday: { id: string; emoji: string; name: string; date: string; }) => void;
  onDelete: (id: string) => void;
}) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      
      // Parse the date and set to current year
      const [month, day] = holiday.date.split('-');
      let holidayDate = new Date(currentYear, parseInt(month) - 1, parseInt(day), 23, 59, 59);
      
      // If the date has passed this year, set it to next year
      if (holidayDate < now) {
        holidayDate = new Date(currentYear + 1, parseInt(month) - 1, parseInt(day), 23, 59, 59);
      }
      
      const timeDiff = holidayDate.getTime() - now.getTime();
      
      if (timeDiff <= 0) {
        setTimeLeftSeconds(0);
        return '🎉 Today!';
      }
      
      setTimeLeftSeconds(timeDiff);
      
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) {
        return `${days}d ${hours}h`;
      } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else if (minutes > 0) {
        return `${minutes}m`;
      } else {
        return 'Less than 1m';
      }
    };

    setTimeLeft(calculateTimeLeft());
    
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [holiday.date]);

  const isToday = timeLeft.includes('Today');
  const isLastMinutes = timeLeft.includes('m') && !timeLeft.includes('d') && !timeLeft.includes('h');

  if (!isClient) {
    return (
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <span>{holiday.emoji}</span>
          <span className="text-[var(--foreground-secondary)]">{holiday.name}</span>
        </div>
        <span className="font-medium text-[var(--foreground)]">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between text-xs group">
      <div className="flex items-center gap-1">
        <span className={isLastMinutes ? 'animate-pulse' : ''}>{holiday.emoji}</span>
        <span className="text-[var(--foreground-secondary)]">{holiday.name}</span>
      </div>
      
      <div className="flex items-center gap-1">
        <span className={`font-medium ${
          isLastMinutes ? 'text-red-500 animate-pulse' : 
          isToday ? 'text-orange-500' : 
          'text-[var(--foreground)]'
        }`}>
          {timeLeft}
        </span>
        
        {/* Edit Button */}
        <button
          onClick={() => onEdit(holiday)}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-[var(--active)] rounded text-[var(--foreground-tertiary)] hover:text-[var(--foreground)]"
          title="Edit holiday"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { hasSeenWelcome, setHasSeenWelcome } = useWelcomeStore();

  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Holiday management state
  const [holidays, setHolidays] = useState([
    { id: '1', emoji: '🎃', name: 'Halloween', date: '10-31' },
    { id: '2', emoji: '🦃', name: 'Thanksgiving', date: '11-28' },
    { id: '3', emoji: '🎄', name: 'Christmas', date: '12-25' },
  ]);
  const [showHolidayEditor, setShowHolidayEditor] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<{ id: string; emoji: string; name: string; date: string; } | null>(null);
  const [newHoliday, setNewHoliday] = useState({ emoji: '🎉', name: '', date: '' });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMusicPlayerVisible, setIsMusicPlayerVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Bunny feeding state
  const [bunnyTreats, setBunnyTreats] = useState<Array<{
    id: string;
    type: 'carrot' | 'hay' | 'lettuce' | 'apple';
    x: number;
    y: number;
    bunnyId: 'white' | 'brown';
  }>>([]);
  
  // Holiday management functions
  const handleEditHoliday = (holiday: { id: string; emoji: string; name: string; date: string; }) => {
    setEditingHoliday(holiday);
    setShowHolidayEditor(true);
  };
  
  const handleDeleteHoliday = (id: string) => {
    setHolidays(holidays.filter(h => h.id !== id));
  };
  
  const handleSaveHoliday = () => {
    if (editingHoliday) {
      // Edit existing holiday
      setHolidays(holidays.map(h => 
        h.id === editingHoliday.id ? editingHoliday : h
      ));
      setEditingHoliday(null);
    } else {
      // Add new holiday
      setHolidays([...holidays, { ...newHoliday, id: Date.now().toString() }]);
      setNewHoliday({ emoji: '🎉', name: '', date: '' });
    }
    setShowHolidayEditor(false);
  };
  
  const handleAddHoliday = () => {
    setEditingHoliday(null);
    setNewHoliday({ emoji: '🎉', name: '', date: '' });
    setShowHolidayEditor(true);
  };
  
  // Bunny feeding functions
  const feedBunny = (bunnyId: 'white' | 'brown', event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const treatTypes: Array<'carrot' | 'hay' | 'lettuce' | 'apple'> = ['carrot', 'hay', 'lettuce', 'apple'];
    const randomTreat = treatTypes[Math.floor(Math.random() * treatTypes.length)];
    
    const newTreat = {
      id: Date.now().toString(),
      type: randomTreat,
      x: rect.left + rect.width / 2,
      y: rect.top - 20,
      bunnyId
    };
    
    setBunnyTreats(prev => [...prev, newTreat]);
    
    // Remove treat after animation
    setTimeout(() => {
      setBunnyTreats(prev => prev.filter(treat => treat.id !== newTreat.id));
    }, 2000);
  };
  
  // Bunny movement state
  const [bunnyPositions, setBunnyPositions] = useState({
    white: { x: 32, y: 20, direction: 1, speed: 0.8 }, // x, y, direction, speed
    brown: { x: 64, y: 8, direction: -1, speed: 0.6 }
  });
  const [isBunnyMovementReady, setIsBunnyMovementReady] = useState(false);
  
  // Get time-based sky theme
  const getSkyTheme = () => {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) {
      // Morning: Bright blue sky with warm sun
      return {
        background: 'from-blue-200 via-blue-100 to-green-200 dark:from-blue-800/40 dark:via-blue-700/30 dark:to-green-800/40',
        sun: '☀️',
        clouds: '☁️',
        mood: 'morning'
      };
    } else if (hour >= 12 && hour < 17) {
      // Afternoon: Bright blue sky with full sun
      return {
        background: 'from-blue-300 via-blue-200 to-green-300 dark:from-blue-700/50 dark:via-blue-600/40 dark:to-green-700/50',
        sun: '☀️',
        clouds: '☁️',
        mood: 'afternoon'
      };
    } else if (hour >= 17 && hour < 20) {
      // Evening: Golden hour with warm colors
      return {
        background: 'from-orange-200 via-yellow-200 to-green-200 dark:from-orange-800/40 dark:via-yellow-800/30 dark:to-green-800/40',
        sun: '🌅',
        clouds: '☁️',
        mood: 'evening'
      };
    } else if (hour >= 20 || hour < 6) {
      // Night: Dark sky with stars and moon
      return {
        background: 'from-indigo-900 via-purple-800 to-green-900 dark:from-indigo-950 dark:via-purple-900 dark:to-green-950',
        sun: '🌙',
        clouds: '☁️',
        mood: 'night'
      };
    }
    
    // Default fallback
    return {
      background: 'from-blue-200 via-blue-100 to-green-200 dark:from-blue-800/40 dark:via-blue-700/30 dark:to-green-800/40',
      sun: '☀️',
      clouds: '☁️',
      mood: 'default'
    };
  };
  
  const skyTheme = getSkyTheme();
  
  // Random bunny movement across the entire sidebar
  useEffect(() => {
    if (!isBunnyMovementReady) {
      setIsBunnyMovementReady(true);
      return;
    }
    
    const interval = setInterval(() => {
      setBunnyPositions(prev => {
        const newPositions = { ...prev };
        
        // White bunny - moves horizontally and vertically
        newPositions.white.x += newPositions.white.direction * newPositions.white.speed;
        newPositions.white.y += (Math.random() - 0.5) * 0.2; // Gentler vertical movement
        
        // Brown bunny - moves in opposite direction with some randomness
        newPositions.brown.x += newPositions.brown.direction * newPositions.brown.speed;
        newPositions.brown.y += (Math.random() - 0.5) * 0.25; // Gentler vertical movement
        
        // Boundary checking - keep bunnies within sidebar bounds
        // X bounds: 16px to 240px (sidebar width)
        if (newPositions.white.x >= 240 || newPositions.white.x <= 16) {
          newPositions.white.direction *= -1; // Reverse direction
          newPositions.white.x = Math.max(16, Math.min(240, newPositions.white.x)); // Clamp to bounds
        }
        if (newPositions.brown.x >= 240 || newPositions.brown.x <= 16) {
          newPositions.brown.direction *= -1; // Reverse direction
          newPositions.brown.x = Math.max(16, Math.min(240, newPositions.brown.x)); // Clamp to bounds
        }
        
        // Y bounds: separate ranges for each bunny to prevent overlap
        // White bunny: upper area (20px to 50px)
        newPositions.white.y = Math.max(20, Math.min(50, newPositions.white.y));
        // Brown bunny: lower area (8px to 35px)
        newPositions.brown.y = Math.max(8, Math.min(35, newPositions.brown.y));
        
        // Random direction changes for more natural movement
        if (Math.random() < 0.005) { // 0.5% chance per frame
          newPositions.white.direction *= -1;
        }
        if (Math.random() < 0.003) { // 0.3% chance per frame
          newPositions.brown.direction *= -1;
        }
        
        return newPositions;
      });
    }, 80); // Faster movement
    
    return () => clearInterval(interval);
  }, [isBunnyMovementReady]);

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load custom logo from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLogo = localStorage.getItem('niko-custom-logo');
      if (savedLogo) {
        setCustomLogo(savedLogo);
      }
    }
  }, []);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCustomLogo(result);
        if (typeof window !== 'undefined') {
          localStorage.setItem('niko-custom-logo', result);
        }
      };
      reader.readAsDataURL(file);
    }
  };



  const toggleSidebar = () => {
    if (isAnimating) return; // Prevent rapid toggling during animation
    
    setIsAnimating(true);
    setIsSidebarCollapsed(!isSidebarCollapsed);
    
    // Reset animation state after transition completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="flex h-screen bg-[var(--background-secondary)] items-center justify-center">
        <div className="text-[var(--foreground)]">Loading...</div>
      </div>
    );
  }



  try {
    if (!hasSeenWelcome) {
      return <WelcomeScreen onEnter={() => setHasSeenWelcome(true)} />;
    }
  } catch (error) {
    console.error('Error in WelcomeScreen:', error);
    // Skip welcome screen if there's an error
  }

  return (
    <div className="flex h-screen relative">
      {/* Floating Background Emojis */}
      <FloatingEmojis />
      
      {/* Spotify Music Player Modal */}
      {isMusicPlayerVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <SpotifyPlayer />
          </div>
        </div>
      )}
      
      {/* Debug info */}
      <div className="fixed top-4 right-4 bg-red-500 text-white p-2 rounded z-50">
        Music Player Visible: {isMusicPlayerVisible ? 'YES' : 'NO'}
      </div>
      
      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-full bg-[var(--background)] border-r border-[var(--border)] z-40 
          transition-all duration-500 ease-out transform-gpu overflow-hidden
          ${isSidebarCollapsed ? 'md:w-20' : 'md:w-64'}
          ${isAnimating ? 'pointer-events-none' : ''}`}
      >


        <div className={`flex flex-col flex-grow pt-6 pb-4 transition-all duration-500 ease-out
          ${isSidebarCollapsed ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          
          {/* Logo/Brand - Top section */}
          <div className={`flex items-center flex-shrink-0 px-6 mb-8 transition-all duration-500 ease-out
            ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={customLogo || '/next.svg'}
                  alt="Niko Logo"
                  className="w-10 h-10 rounded-lg cursor-pointer hover:scale-110 transition-transform duration-200"
                  onClick={() => fileInputRef.current?.click()}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>
              <h1 className={`text-xl font-semibold text-[var(--foreground)] transition-all duration-500 ease-out
                ${isSidebarCollapsed ? 'opacity-0 scale-95 translate-x-2' : 'opacity-100 scale-100 translate-x-0'}`}>
                Niko
              </h1>
            </div>
          </div>
          
          {/* Main Navigation - Core app navigation */}
          <div className={`flex-1 transition-all duration-500 ease-out mb-8
            ${isSidebarCollapsed ? 'px-2' : 'px-6'}`}>
            <Navigation isCollapsed={isSidebarCollapsed} />
          </div>
          
          {/* Utility Controls - Theme and Music */}
          <div className={`mb-6 transition-all duration-500 ease-out
            ${isSidebarCollapsed ? 'px-2' : 'px-6'}`}>
            <div className={`flex items-center justify-center gap-3 transition-all duration-500 ease-out
              ${isSidebarCollapsed ? 'flex-col w-full' : ''}`}>
              <ThemeToggle />
              {/* TEST: Simple button instead of MusicToggle */}
              <button
                onClick={() => {
                  console.log('TEST BUTTON CLICKED! Current state:', isMusicPlayerVisible);
                  setIsMusicPlayerVisible(!isMusicPlayerVisible);
                  console.log('New state will be:', !isMusicPlayerVisible);
                }}
                className="w-10 h-10 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                title="Test Music Button"
              >
                🎵
              </button>
            </div>
          </div>
          
          {/* Fun Features Section - Holidays and Bunnies */}
          {!isSidebarCollapsed && (
            <div className={`transition-all duration-500 ease-out mb-6
              ${isSidebarCollapsed ? 'px-2' : 'px-6'}`}>
              
              {/* Holiday Countdown */}
              <div className="mb-6 p-4 bg-[var(--hover)] rounded-xl border border-[var(--border)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-[var(--foreground)]">
                    🎉 Holiday Countdown
                  </div>
                  <button
                    onClick={handleAddHoliday}
                    className="text-xs text-[var(--foreground-tertiary)] hover:text-[var(--foreground)] p-1.5 hover:bg-[var(--active)] rounded-lg transition-colors"
                    title="Add holiday"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-2.5">
                  {holidays.map((holiday) => (
                    <HolidayCountdown 
                      key={holiday.id}
                      holiday={holiday}
                      onEdit={handleEditHoliday}
                      onDelete={handleDeleteHoliday}
                    />
                  ))}
                </div>
              </div>
              
              {/* Animated Bunnies */}
              <div className={`relative h-24 overflow-hidden bg-gradient-to-b ${skyTheme.background} rounded-xl border border-[var(--border)] p-4`}>
                
                {/* Sky Elements */}
                <div className="absolute top-1 left-2 text-lg opacity-60 animate-pulse">{skyTheme.clouds}</div>
                <div className="absolute top-2 right-3 text-sm opacity-50 animate-pulse" style={{ animationDelay: '1s' }}>{skyTheme.clouds}</div>
                <div className="absolute top-3 left-8 text-base opacity-40 animate-pulse" style={{ animationDelay: '2s' }}>{skyTheme.clouds}</div>
                
                {/* Sun/Moon */}
                <div className="absolute top-1 right-1 text-lg animate-pulse">{skyTheme.sun}</div>
                
                {/* Stars for night time */}
                {skyTheme.mood === 'night' && (
                  <>
                    <div className="absolute top-2 left-6 text-xs opacity-80 animate-pulse">⭐</div>
                    <div className="absolute top-3 right-6 text-xs opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }}>⭐</div>
                    <div className="absolute top-1 left-10 text-xs opacity-70 animate-pulse" style={{ animationDelay: '1.5s' }}>⭐</div>
                    <div className="absolute top-4 right-1 text-xs opacity-50 animate-pulse" style={{ animationDelay: '2.5s' }}>⭐</div>
                  </>
                )}
                
                {/* Grass and Ground */}
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-green-300 via-green-200 to-green-100 dark:from-green-700 dark:via-green-600 dark:to-green-500"></div>
                
                {/* Flowers and Plants */}
                <div className="absolute bottom-2 left-3 text-xs">🌸</div>
                <div className="absolute bottom-2 right-4 text-xs">🌻</div>
                <div className="absolute bottom-2 left-12 text-xs">🌷</div>
                <div className="absolute bottom-3 right-8 text-xs">🌱</div>
                <div className="absolute bottom-3 left-6 text-xs">🌿</div>
                
                {/* Small decorative elements */}
                <div className="absolute bottom-4 left-8 text-xs opacity-70">✨</div>
                <div className="absolute bottom-4 right-2 text-xs opacity-70">✨</div>
                
                {/* White Bunny */}
                <button
                  onClick={(e) => feedBunny('white', e)}
                  className="absolute cursor-pointer hover:scale-110 transition-all duration-200 z-10" 
                  style={{ 
                    left: isBunnyMovementReady ? `${bunnyPositions.white.x}px` : '32px',
                    bottom: isBunnyMovementReady ? `${bunnyPositions.white.y}px` : '16px'
                  }}
                  title="Feed the white bunny! 🥕"
                >
                  <div className="text-2xl filter brightness-150 contrast-110 drop-shadow-[0_0_2px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.3)] animate-bounce" style={{ animationDelay: '0s' }}>🐰</div>
                </button>
                
                {/* Brown Bunny */}
                <button
                  onClick={(e) => feedBunny('brown', e)}
                  className="absolute cursor-pointer hover:scale-110 transition-all duration-200 z-10" 
                  style={{ 
                    left: isBunnyMovementReady ? `${bunnyPositions.brown.x}px` : '64px',
                    bottom: isBunnyMovementReady ? `${bunnyPositions.brown.y}px` : '12px'
                  }}
                  title="Feed the brown bunny! 🥕"
                >
                  <div className="text-2xl filter sepia brightness-75 contrast-125 drop-shadow-[0_0_2px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.3)] animate-bounce" style={{ animationDelay: '1s' }}>🐰</div>
                </button>
                
                {/* Bunny Trail */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pink-200 to-transparent opacity-30 animate-bunny-trail"></div>
                
                {/* Floating Treats */}
                {bunnyTreats.map((treat) => (
                  <div
                    key={treat.id}
                    className="absolute pointer-events-none animate-bounce z-20"
                    style={{
                      left: treat.x - 20,
                      top: treat.y,
                      zIndex: 1000
                    }}
                  >
                    <div className="text-2xl animate-ping">
                      {treat.type === 'carrot' && '🥕'}
                      {treat.type === 'hay' && '🌾'}
                      {treat.type === 'lettuce' && '🥬'}
                      {treat.type === 'apple' && '🍎'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Collapse Toggle - Bottom section */}
          <div className={`mt-auto pt-4 border-t border-[var(--border)] transition-all duration-500 ease-out
            ${isSidebarCollapsed ? 'px-2' : 'px-6'}`}>
            <div className="flex justify-center">
              <button
                onClick={toggleSidebar}
                className="group flex items-center gap-2 px-3 py-2 text-sm text-[var(--foreground-secondary)] hover:text-[var(--foreground)] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg hover:bg-[var(--hover)] transition-all duration-200 hover:shadow-sm"
                title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <div className={`transform transition-all duration-300 ${isSidebarCollapsed ? 'rotate-180' : 'rotate-0'}`}>
                  <ChevronLeft className="w-4 h-4" />
                </div>
                {!isSidebarCollapsed && (
                  <span className="text-xs font-medium">
                    {isSidebarCollapsed ? 'Expand' : 'Collapse'}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[var(--background)] border-b border-[var(--border)] px-4 py-3">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-[#2e75cc] to-[#9b8afb] rounded-md flex items-center justify-center mr-3">
            {customLogo ? (
              <img 
                src={customLogo} 
                alt="Custom Logo" 
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <span className="text-white font-bold text-lg">N</span>
            )}
          </div>
          <h1 className="text-lg font-semibold text-[var(--foreground)]">Niko</h1>
        </div>
      </div>

                  {/* Main content */}
            <div className={`md:flex md:flex-col md:flex-1 transition-all duration-300 ease-in-out ${
              isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
            }`}>
              <main className="flex-1 transition-all duration-500 ease-out transform-gpu">
                <div className="p-6 w-full relative" style={{ 
                  background: 'transparent',
                  boxShadow: 'none',
                  outline: 'none',
                  border: 'none'
                }}>
                  {children}
                </div>
              </main>
            </div>
      
      {/* Holiday Editor Modal */}
      {showHolidayEditor && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[var(--background)] rounded-xl shadow-2xl border border-[var(--border)] w-full max-w-md animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                {editingHoliday ? 'Edit Holiday' : 'Add New Holiday'}
              </h3>
              
              <div className="space-y-4">
                {/* Emoji Picker */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-2">
                    Emoji
                  </label>
                  <div className="grid grid-cols-8 gap-2">
                    {['🎉', '🎃', '🦃', '🎄', '🎊', '🎈', '🎁', '⭐', '🌙', '☀️', '🌸', '🍁', '❄️', '🔥', '💫', '✨'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          if (editingHoliday) {
                            setEditingHoliday({ ...editingHoliday, emoji });
                          } else {
                            setNewHoliday({ ...newHoliday, emoji });
                          }
                        }}
                        className={`p-2 rounded-lg text-lg hover:bg-[var(--hover)] transition-colors ${
                          (editingHoliday ? editingHoliday.emoji : newHoliday.emoji) === emoji 
                            ? 'bg-[var(--primary)] text-white' 
                            : 'bg-[var(--background-secondary)]'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-2">
                    Holiday Name
                  </label>
                  <input
                    type="text"
                    value={editingHoliday ? editingHoliday.name : newHoliday.name}
                    onChange={(e) => {
                      if (editingHoliday) {
                        setEditingHoliday({ ...editingHoliday, name: e.target.value });
                      } else {
                        setNewHoliday({ ...newHoliday, name: e.target.value });
                      }
                    }}
                    placeholder="e.g., My Birthday"
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
                
                {/* Date Input */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-2">
                    Date (MM-DD)
                  </label>
                  <input
                    type="text"
                    value={editingHoliday ? editingHoliday.date : newHoliday.date}
                    onChange={(e) => {
                      if (editingHoliday) {
                        setEditingHoliday({ ...editingHoliday, date: e.target.value });
                      } else {
                        setNewHoliday({ ...newHoliday, date: e.target.value });
                      }
                    }}
                    placeholder="e.g., 12-25"
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowHolidayEditor(false)}
                  className="flex-1 px-4 py-2 border border-[var(--border)] text-[var(--foreground)] rounded-lg hover:bg-[var(--hover)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveHoliday}
                  disabled={!(editingHoliday ? editingHoliday.name && editingHoliday.date : newHoliday.name && newHoliday.date)}
                  className="flex-1 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingHoliday ? 'Save Changes' : 'Add Holiday'}
                </button>
              </div>
              
              {/* Delete Button for Editing */}
              {editingHoliday && (
                <button
                  onClick={() => {
                    handleDeleteHoliday(editingHoliday.id);
                    setShowHolidayEditor(false);
                  }}
                  className="w-full mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete Holiday
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Music Player */}
      

    </div>
  );
}
