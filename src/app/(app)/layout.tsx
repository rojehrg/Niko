"use client";

import { Navigation } from "@/components/ui/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { FloatingEmojis } from "@/components/ui/floating-emojis";
import { SidebarUsername } from "@/components/ui/sidebar-username";

import { WelcomeScreen } from "@/components/welcome/welcome-screen";
import { useWelcomeStore } from "@/lib/stores/welcome-store";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, Music } from "lucide-react";


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
      return 'morning'; // Morning: bright blue
    } else if (hour >= 12 && hour < 18) {
      return 'afternoon'; // Afternoon: bright blue
    } else if (hour >= 18 && hour < 20) {
      return 'evening'; // Evening: orange/pink
    } else {
      return 'night'; // Night: dark blue
    }
  };

  // Bunny movement effect
  useEffect(() => {
    if (!isBunnyMovementReady) return;
    
    const moveBunnies = () => {
      setBunnyPositions(prev => {
        const newPositions = { ...prev };
        
        // White bunny - moves horizontally and vertically
        newPositions.white.x += newPositions.white.direction * newPositions.white.speed;
        newPositions.white.y += Math.sin(Date.now() * 0.001) * 0.5;
        
        // Brown bunny - moves in a different pattern
        newPositions.brown.x += newPositions.brown.direction * newPositions.brown.speed;
        newPositions.brown.y += Math.cos(Date.now() * 0.001) * 0.3;
        
        // Bounce off edges
        if (newPositions.white.x <= 0 || newPositions.white.x >= 100) {
          newPositions.white.direction *= -1;
        }
        if (newPositions.brown.x <= 0 || newPositions.brown.x >= 100) {
          newPositions.brown.direction *= -1;
        }
        
        // Keep bunnies within bounds
        newPositions.white.x = Math.max(0, Math.min(100, newPositions.white.x));
        newPositions.white.y = Math.max(0, Math.min(100, newPositions.white.y));
        newPositions.brown.x = Math.max(0, Math.min(100, newPositions.brown.x));
        newPositions.brown.y = Math.max(0, Math.min(100, newPositions.brown.y));
        
        return newPositions;
      });
    };
    
    const interval = setInterval(moveBunnies, 50);
    return () => clearInterval(interval);
  }, [isBunnyMovementReady]);

  // Mount effect
  useEffect(() => {
    setIsMounted(true);
    setIsBunnyMovementReady(true);
  }, []);

  // Welcome screen logic
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
          <div className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-md max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-black/20 backdrop-blur-sm border-b border-gray-700 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Spotify Player</h3>
              </div>
              <button
                onClick={() => setIsMusicPlayerVisible(false)}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Spotify Search and Embed */}
            <div className="p-4 space-y-4">
              {/* Search Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search for songs, artists, or albums..."
                  className="flex-1 bg-gray-800 text-white placeholder-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const searchTerm = (e.target as HTMLInputElement).value.trim();
                      if (searchTerm) {
                        const encodedSearch = encodeURIComponent(searchTerm);
                        const embedUrl = `https://open.spotify.com/embed/search/${encodedSearch}`;
                        const iframe = document.getElementById('spotify-iframe') as HTMLIFrameElement;
                        if (iframe) iframe.src = embedUrl;
                      }
                    }
                  }}
                />
                <button
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    const searchTerm = input.value.trim();
                    if (searchTerm) {
                      const encodedSearch = encodeURIComponent(searchTerm);
                      const embedUrl = `https://open.spotify.com/embed/search/${encodedSearch}`;
                      const iframe = document.getElementById('spotify-iframe') as HTMLIFrameElement;
                      if (iframe) iframe.src = embedUrl;
                    }
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  Search
                </button>
              </div>
              
              {/* Quick Access Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    const iframe = document.getElementById('spotify-iframe') as HTMLIFrameElement;
                    if (iframe) iframe.src = 'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M';
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  Today's Top Hits
                </button>
                <button
                  onClick={() => {
                    const iframe = document.getElementById('spotify-iframe') as HTMLIFrameElement;
                    if (iframe) iframe.src = 'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M';
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  Today's Top Hits
                </button>
                <button
                  onClick={() => {
                    const iframe = document.getElementById('spotify-iframe') as HTMLIFrameElement;
                    if (iframe) iframe.src = 'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M';
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  Today's Top Hits
                </button>
              </div>
            </div>
            
            {/* Spotify iframe */}
            <div className="p-4">
              <iframe
                id="spotify-iframe"
                src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M"
                width="100%"
                height="300"
                frameBorder="0"
                allow="encrypted-media"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`flex flex-col bg-[var(--background-secondary)] border-r border-[var(--border)] transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-[var(--border)]">
          <div className="flex items-center justify-between">
            {!isSidebarCollapsed && (
              <SidebarUsername />
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-[var(--hover)] transition-colors"
            >
              <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${
                isSidebarCollapsed ? 'rotate-180' : ''
              }`} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <Navigation isCollapsed={isSidebarCollapsed} />

        {/* Animated Bunnies Section */}
        {!isSidebarCollapsed && (
          <div className="p-4 border-t border-[var(--border)]">
            <div className="relative h-24 overflow-hidden bg-gradient-to-b from-blue-200 via-blue-100 to-green-200 dark:from-blue-800/40 dark:via-blue-700/30 dark:to-green-800/40 rounded-xl border border-[var(--border)] p-4">
              
              {/* Sky Elements */}
              <div className="absolute top-1 left-2 text-lg opacity-60 animate-pulse">☁️</div>
              <div className="absolute top-2 right-3 text-sm opacity-50 animate-pulse" style={{ animationDelay: '1s' }}>☁️</div>
              <div className="absolute top-3 left-8 text-base opacity-40 animate-pulse" style={{ animationDelay: '2s' }}>☁️</div>
              
              {/* Sun */}
              <div className="absolute top-1 right-1 text-lg animate-pulse">☀️</div>
              
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

        {/* Holiday Countdown */}
        <div className="mt-auto p-4 border-t border-[var(--border)]">
          <div className="space-y-3">
            {holidays.map((holiday) => (
              <HolidayCountdown
                key={holiday.id}
                holiday={holiday}
                onEdit={handleEditHoliday}
                onDelete={handleDeleteHoliday}
              />
            ))}
            <button
              onClick={handleAddHoliday}
              className="w-full p-2 text-xs text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--hover)] rounded-lg transition-colors"
            >
              + Add Holiday
            </button>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="p-4 border-t border-[var(--border)]">
          <ThemeToggle />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full">
          <div className="p-6 w-full relative" style={{ 
            background: 'transparent',
            boxShadow: 'none',
            outline: 'none',
            border: 'none'
          }}>
            {children}
          </div>
        </div>
      </main>
      
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
                    placeholder="e.g., My Birthday"
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
