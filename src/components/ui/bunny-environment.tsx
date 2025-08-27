"use client";

import { useState, useEffect, useCallback } from 'react';

export function BunnyEnvironment() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDaytime, setIsDaytime] = useState(true);

  // Cute sound effect when touching bunnies
  const playBunnySound = useCallback(() => {
    try {
      // Create audio context for cute beep sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Cute high-pitched beep
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log('Audio not supported, but bunny was touched! 🐰');
    }
  }, []);

  useEffect(() => {
    // Check if it's daytime based on user's timezone
    const checkTimeOfDay = () => {
      const now = new Date();
      const hour = now.getHours();
      // Daytime: 6 AM to 6 PM (6:00 - 18:00)
      setIsDaytime(hour >= 6 && hour < 18);
    };

    checkTimeOfDay();
    // Update every minute to handle day/night transitions
    const interval = setInterval(checkTimeOfDay, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Toggle Button - Bottom Right */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 w-12 h-12 rounded-2xl bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-600 shadow-lg z-50 flex items-center justify-center backdrop-blur-sm hover:shadow-xl transition-all duration-200"
      >
        <span className="text-xl">🐰</span>
      </button>

      {/* Simple Running Bunnies - Only show when visible */}
      {isVisible && (
        <div className="fixed bottom-0 left-0 right-0 h-20 z-40 overflow-hidden">
          {/* Grass background - at the very bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-full" style={{
            backgroundImage: 'url(/sprites/grass.png)',
            backgroundSize: 'auto 100%',
            backgroundPosition: 'bottom',
            backgroundRepeat: 'repeat-x'
          }} />
          
          {/* Sun/Moon above the grass field with clouds - LARGE and CENTERED */}
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-30">
            {/* Cloud behind sun/moon */}
            <div className="absolute -top-4 -left-4 z-20">
              <img 
                src="/sprites/cloud.png" 
                alt="Cloud" 
                className="w-24 h-24"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            {/* Sun/Moon */}
            <img 
              src={isDaytime ? "/sprites/sun.png" : "/sprites/moon.png"}
              alt={isDaytime ? "Sun" : "Moon"}
              className="w-20 h-20 relative z-30"
              style={{ imageRendering: 'pixelated' }}
            />
            {/* Cloud in front of sun/moon */}
            <div className="absolute -top-4 -right-4 z-40">
              <img 
                src="/sprites/cloud.png" 
                alt="Cloud" 
                className="w-20 h-20"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
          </div>
          
          {/* Flowers scattered across the grass */}
          <div className="absolute bottom-2 left-20 z-20">
            <img 
              src="/sprites/flower.png" 
              alt="Flower" 
              className="w-6 h-6"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <div className="absolute bottom-2 left-80 z-20">
            <img 
              src="/sprites/flower.png" 
              alt="Flower" 
              className="w-6 h-6"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <div className="absolute bottom-2 left-140 z-20">
            <img 
              src="/sprites/flower.png" 
              alt="Flower" 
              className="w-6 h-6"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <div className="absolute bottom-2 right-40 z-20">
            <img 
              src="/sprites/flower.png" 
              alt="Flower" 
              className="w-6 h-6"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <div className="absolute bottom-2 right-100 z-20">
            <img 
              src="/sprites/flower.png" 
              alt="Flower" 
              className="w-6 h-6"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          
          {/* G-small plants scattered around */}
          <div className="absolute bottom-1 left-50 z-20">
            <img 
              src="/sprites/gsmall.png" 
              alt="Small plant" 
              className="w-5 h-5"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <div className="absolute bottom-3 left-110 z-20">
            <img 
              src="/sprites/gsmall.png" 
              alt="Small plant" 
              className="w-5 h-5"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <div className="absolute bottom-1 right-60 z-20">
            <img 
              src="/sprites/gsmall.png" 
              alt="Small plant" 
              className="w-5 h-5"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          
          {/* Plant-bushy scattered around */}
          <div className="absolute bottom-2 left-35 z-20">
            <img 
              src="/sprites/plant-bushy.png" 
              alt="Bushy plant" 
              className="w-7 h-7"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <div className="absolute bottom-2 left-95 z-20">
            <img 
              src="/sprites/plant-bushy.png" 
              alt="Bushy plant" 
              className="w-7 h-7"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <div className="absolute bottom-2 right-75 z-20">
            <img 
              src="/sprites/plant-bushy.png" 
              alt="Bushy plant" 
              className="w-7 h-7"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          
          {/* Large trees scattered around */}
          <div className="absolute bottom-0 left-30 z-30">
            <img 
              src="/sprites/tree-large.png" 
              alt="Large tree" 
              className="w-16 h-16"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <div className="absolute bottom-0 left-90 z-30">
            <img 
              src="/sprites/tree-large.png" 
              alt="Large tree" 
              className="w-16 h-16"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <div className="absolute bottom-0 right-50 z-30">
            <img 
              src="/sprites/tree-large.png" 
              alt="Large tree" 
              className="w-16 h-16"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          
          {/* White Bunny - Running left to right on top of grass */}
          <div 
            className="absolute bottom-4 animate-bunny-left-to-right z-10 cursor-pointer hover:scale-110 transition-transform duration-200"
            onClick={playBunnySound}
            title="Click me for a cute sound! 🐰"
          >
            <img 
              src="/sprites/rabbit-white.png" 
              alt="White rabbit" 
              className="w-12 h-12"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          
          {/* Brown Bunny - Running right to left on top of grass */}
          <div 
            className="absolute bottom-4 animate-bunny-right-to-left z-10 cursor-pointer hover:scale-110 transition-transform duration-200"
            onClick={playBunnySound}
            title="Click me for a cute sound! 🐰"
          >
            <img 
              src="/sprites/rabbit-brown.png" 
              alt="Brown rabbit" 
              className="w-12 h-12"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes bunny-left-to-right {
          0% { left: -3rem; }
          25% { left: 20%; }
          50% { left: 45%; }
          75% { left: 70%; }
          100% { left: calc(100% + 3rem); }
        }
        
        @keyframes bunny-right-to-left {
          0% { right: -3rem; }
          25% { right: 70%; }
          50% { right: 45%; }
          75% { right: 20%; }
          100% { right: calc(100% + 3rem); }
        }
        
        @keyframes bunny-hop {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        .animate-bunny-left-to-right {
          animation: 
            bunny-left-to-right 25s ease-in-out infinite,
            bunny-hop 0.8s ease-in-out infinite;
        }
        
        .animate-bunny-right-to-left {
          animation: 
            bunny-right-to-left 30s ease-in-out infinite,
            bunny-hop 0.9s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
