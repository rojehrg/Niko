"use client";

import { useState, useEffect, useCallback } from 'react';

export function BunnyEnvironment() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDaytime, setIsDaytime] = useState(true);

  // Sound effects for bunnies
  const playBrownBunnySound = useCallback(() => {
    try {
      // Stop any currently playing brown bunny audio
      if ((window as any).currentBrownBunnyAudio) {
        (window as any).currentBrownBunnyAudio.pause();
        (window as any).currentBrownBunnyAudio.currentTime = 0;
      }
      
      const audio = new Audio('/sprites/brownbunnytalking.mp3');
      audio.volume = 0.7;
      audio.loop = false; // Ensure it doesn't loop
      
      // Store reference to current audio
      (window as any).currentBrownBunnyAudio = audio;
      
      audio.play().catch(error => {
        console.log('Audio playback failed:', error);
      });
      
      // Stop audio after 5 seconds
      setTimeout(() => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      }, 5000);
    } catch (error) {
      console.log('Audio not supported, but brown bunny was touched! 🐰');
    }
  }, []);

  const playWhiteBunnySound = useCallback(() => {
    try {
      // Stop any currently playing white bunny audio
      if ((window as any).currentWhiteBunnyAudio) {
        (window as any).currentWhiteBunnyAudio.pause();
        (window as any).currentWhiteBunnyAudio.currentTime = 0;
      }
      
      const audio = new Audio('/sprites/whitebunnytalking.mp3');
      audio.volume = 0.7;
      audio.loop = false; // Ensure it doesn't loop
      
      // Store reference to current audio
      (window as any).currentWhiteBunnyAudio = audio;
      
      audio.play().catch(error => {
        console.log('Audio playback failed:', error);
      });
      
      // Stop audio after 5 seconds
      setTimeout(() => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      }, 5000);
    } catch (error) {
      console.log('Audio not supported, but white bunny was touched! 🐰');
    }
  }, []);

  // Sound effects for flashcard answers
  const playCorrectSound = useCallback(() => {
    try {
      const audio = new Audio('/sprites/correct.mp3');
      audio.volume = 0.8;
      audio.play().catch(error => {
        console.log('Audio playback failed:', error);
      });
      
      // Stop audio after 5 seconds
      setTimeout(() => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      }, 5000);
    } catch (error) {
      console.log('Audio not supported');
    }
  }, []);

  const playWrongSound = useCallback(() => {
    try {
      const audio = new Audio('/sprites/wrong.mp3');
      audio.volume = 0.8;
      audio.play().catch(error => {
        console.log('Audio playback failed:', error);
      });
      
      // Stop audio after 5 seconds
      setTimeout(() => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      }, 5000);
    } catch (error) {
      console.log('Audio not supported');
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

  useEffect(() => {
    // Listen for toggle event from the bunny button in layout
    const handleToggle = () => setIsVisible(!isVisible);
    window.addEventListener('toggleBunnyEnvironment', handleToggle);
    
    return () => window.removeEventListener('toggleBunnyEnvironment', handleToggle);
  }, [isVisible]);

  return (
    <>


      {/* Simple Running Bunnies - Only show when visible */}
      {isVisible && (
        <>
          {/* Dynamic Sky Background - Day/Night based on timezone */}
          <div className="fixed top-190 left-0 right-0 bottom-0 z-0 pointer-events-none">
            <div className={`w-full h-full transition-all duration-1000 ${
              isDaytime 
                ? 'bg-gradient-to-b from-[var(--background)] from-0% via-gray-200/60 via-10% to-gray-100/50 to-100% dark:from-[var(--background)] dark:via-sky-200/60 dark:via-10% dark:to-blue-100/50 dark:to-100%' 
                : 'bg-gradient-to-b from-[var(--background)] from-0% via-slate-800/60 via-10% to-slate-700/50 to-100% dark:from-[var(--background)] dark:via-slate-900/60 dark:via-10% dark:to-slate-800/50 dark:to-100%'
            }`}>
              {/* Day sky elements */}
              {isDaytime && (
                <>
                  <div className="absolute top-10 left-20 w-2 h-2 bg-gray-300/80 dark:bg-yellow-300/90 rounded-full animate-pulse shadow-lg"></div>
                  <div className="absolute top-15 left-40 w-1 h-1 bg-gray-200/70 dark:bg-yellow-200/80 rounded-full animate-pulse shadow-md"></div>
                  <div className="absolute top-8 left-60 w-1.5 h-1.5 bg-gray-300/80 dark:bg-yellow-300/90 rounded-full animate-pulse shadow-lg"></div>
                  <div className="absolute top-12 left-80 w-1 h-1 bg-gray-200/60 dark:bg-yellow-100/70 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-6 left-100 w-1.5 h-1.5 bg-gray-300/70 dark:bg-yellow-200/80 rounded-full animate-pulse shadow-md"></div>
                </>
              )}
              {/* Night sky elements */}
              {!isDaytime && (
                <>
                  {/* Constellation 1 - Left side */}
                  <div className="absolute top-8 left-10 w-1 h-1 bg-gray-100/90 dark:bg-blue-200/80 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-20 left-30 w-0.5 h-0.5 bg-gray-50/80 dark:bg-blue-100/70 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-12 left-50 w-1 h-1 bg-gray-100/90 dark:bg-blue-200/80 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-25 left-70 w-0.5 h-0.5 bg-gray-50/80 dark:bg-blue-100/70 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-15 left-90 w-1 h-1 bg-gray-100/90 dark:bg-blue-200/80 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-35 left-15 w-0.5 h-0.5 bg-gray-50/80 dark:bg-blue-100/70 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-18 left-45 w-1 h-1 bg-gray-100/90 dark:bg-blue-200/80 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-30 left-65 w-0.5 h-0.5 bg-gray-50/80 dark:bg-blue-100/70 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-22 left-85 w-1 h-1 bg-gray-100/90 dark:bg-blue-200/80 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-40 left-25 w-0.5 h-0.5 bg-gray-50/80 dark:bg-blue-100/70 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-28 left-55 w-1 h-1 bg-gray-100/90 dark:bg-blue-200/80 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-32 left-75 w-0.5 h-0.5 bg-gray-50/80 dark:bg-blue-100/70 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-16 left-95 w-1 h-1 bg-gray-100/90 dark:bg-blue-200/80 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-38 left-35 w-0.5 h-0.5 bg-gray-50/80 dark:bg-blue-100/70 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-26 left-80 w-1 h-1 bg-gray-100/90 dark:bg-blue-200/80 rounded-full animate-pulse shadow-sm"></div>
                  
                  {/* Constellation 2 - Center */}
                  <div className="absolute top-10 left-[20%] w-1 h-1 bg-blue-100/90 dark:bg-blue-200/80 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-25 left-[25%] w-0.5 h-0.5 bg-blue-50/80 dark:bg-blue-100/70 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-15 left-[30%] w-1 h-1 bg-blue-100/90 dark:bg-blue-200/80 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-35 left-[35%] w-0.5 h-0.5 bg-blue-50/80 dark:bg-blue-100/70 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-20 left-[40%] w-1 h-1 bg-blue-100/90 dark:bg-blue-200/80 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-30 left-[45%] w-0.5 h-0.5 bg-blue-50/80 dark:bg-blue-100/70 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-18 left-[50%] w-1 h-1 bg-blue-100/90 dark:bg-blue-200/80 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-28 left-[55%] w-0.5 h-0.5 bg-blue-50/80 dark:bg-blue-100/70 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-22 left-[60%] w-1 h-1 bg-blue-100/90 dark:bg-blue-200/80 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-32 left-[65%] w-0.5 h-0.5 bg-blue-50/80 dark:bg-blue-100/70 rounded-full animate-pulse shadow-sm"></div>
                  
                  {/* Constellation 3 - Right side */}
                  <div className="absolute top-12 left-[70%] w-1 h-1 bg-blue-100/90 dark:bg-blue-200/80 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-26 left-[75%] w-0.5 h-0.5 bg-blue-50/80 dark:bg-blue-100/70 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-16 left-[80%] w-1 h-1 bg-blue-100/90 dark:bg-blue-200/80 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-34 left-[85%] w-0.5 h-0.5 bg-blue-50/80 dark:bg-blue-100/70 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-24 left-[90%] w-1 h-1 bg-blue-100/90 dark:bg-blue-200/80 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-36 left-[95%] w-0.5 h-0.5 bg-blue-50/80 dark:bg-blue-100/70 rounded-full animate-pulse shadow-sm"></div>
                  
                  {/* Scattered stars across the sky */}
                  <div className="absolute top-5 left-[15%] w-0.5 h-0.5 bg-blue-50/80 dark:bg-blue-100/70 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-42 left-[5%] w-1 h-1 bg-blue-100/90 dark:bg-blue-200/80 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-8 left-[80%] w-0.5 h-0.5 bg-blue-50/80 dark:bg-blue-100/70 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-45 left-[90%] w-1 h-1 bg-blue-100/90 dark:bg-blue-200/80 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-3 left-[45%] w-0.5 h-0.5 bg-blue-50/80 dark:bg-blue-100/70 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-38 left-[10%] w-1 h-1 bg-blue-100/90 dark:bg-blue-200/80 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-6 left-[85%] w-0.5 h-0.5 bg-blue-50/80 dark:bg-blue-100/70 rounded-full animate-pulse shadow-sm"></div>
                  <div className="absolute top-40 left-[95%] w-1 h-1 bg-blue-100/90 dark:bg-blue-200/80 rounded-full animate-pulse shadow-sm"></div>
                </>
              )}
            </div>
          </div>
          
          {/* Individual grass field PNGs - positioned side by side with no gaps */}
          {/* Grass field background - responsive coverage that scales with viewport */}
          <div className="fixed bottom-[-63px] left-0 z-1 pointer-events-none">
            <img 
              src="/sprites/acgrassfield.png" 
              alt="Grass field" 
              className="h-48"
            />
          </div>
          <div className="fixed bottom-[-63px] left-[10vw] z-1 pointer-events-none">
            <img 
              src="/sprites/acgrassfield.png" 
              alt="Grass field" 
              className="h-48"
            />
          </div>
          <div className="fixed bottom-[-63px] left-[20vw] z-1 pointer-events-none">
            <img 
              src="/sprites/acgrassfield.png" 
              alt="Grass field" 
              className="h-48"
            />
          </div>
          <div className="fixed bottom-[-63px] left-[30vw] z-1 pointer-events-none">
            <img 
              src="/sprites/acgrassfield.png" 
              alt="Grass field" 
              className="h-48"
            />
          </div>
          <div className="fixed bottom-[-63px] left-[40vw] z-1 pointer-events-none">
            <img 
              src="/sprites/acgrassfield.png" 
              alt="Grass field" 
              className="h-48"
            />
          </div>
          <div className="fixed bottom-[-63px] left-[50vw] z-1 pointer-events-none">
            <img 
              src="/sprites/acgrassfield.png" 
              alt="Grass field" 
              className="h-48"
            />
          </div>
          <div className="fixed bottom-[-63px] left-[60vw] z-1 pointer-events-none">
            <img 
              src="/sprites/acgrassfield.png" 
              alt="Grass field" 
              className="h-48"
            />
          </div>
          <div className="fixed bottom-[-63px] left-[70vw] z-1 pointer-events-none">
            <img 
              src="/sprites/acgrassfield.png" 
              alt="Grass field" 
              className="h-48"
            />
          </div>
          <div className="fixed bottom-[-63px] left-[80vw] z-1 pointer-events-none">
            <img 
              src="/sprites/acgrassfield.png" 
              alt="Grass field" 
              className="h-48"
            />
          </div>
          <div className="fixed bottom-[-63px] left-[90vw] z-1 pointer-events-none">
            <img 
              src="/sprites/acgrassfield.png" 
              alt="Grass field" 
              className="h-48"
            />
          </div>
          <div className="fixed bottom-[-63px] left-[100vw] z-1 pointer-events-none">
            <img 
              src="/sprites/acgrassfield.png" 
              alt="Grass field" 
              className="h-48"
            />
          </div>
          <div className="fixed bottom-[-63px] left-[110vw] z-1 pointer-events-none">
            <img 
              src="/sprites/acgrassfield.png" 
              alt="Grass field" 
              className="h-48"
            />
          </div>
          <div className="fixed bottom-[-63px] left-[120vw] z-1 pointer-events-none">
            <img 
              src="/sprites/acgrassfield.png" 
              alt="Grass field" 
              className="h-48"
            />
          </div>
          <div className="fixed bottom-[-63px] left-[130vw] z-1 pointer-events-none">
            <img 
              src="/sprites/acgrassfield.png" 
              alt="Grass field" 
              className="h-48"
            />
          </div>
          <div className="fixed bottom-[-63px] left-[140vw] z-1 pointer-events-none">
            <img 
              src="/sprites/acgrassfield.png" 
              alt="Grass field" 
              className="h-48"
            />
          </div>
          <div className="fixed bottom-[-63px] left-[150vw] z-1 pointer-events-none">
            <img 
              src="/sprites/acgrassfield.png" 
              alt="Grass field" 
              className="h-48"
            />
          </div>
          <div className="fixed bottom-[-63px] left-[160vw] z-1 pointer-events-none">
            <img 
              src="/sprites/acgrassfield.png" 
              alt="Grass field" 
              className="h-48"
            />
          </div>
          <div className="fixed bottom-[-63px] left-[170vw] z-1 pointer-events-none">
            <img 
              src="/sprites/acgrassfield.png" 
              alt="Grass field" 
              className="h-48"
            />
          </div>
          <div className="fixed bottom-[-63px] left-[180vw] z-1 pointer-events-none">
            <img 
              src="/sprites/acgrassfield.png" 
              alt="Grass field" 
              className="h-48"
            />
          </div>
          <div className="fixed bottom-[-63px] left-[190vw] z-1 pointer-events-none">
            <img 
              src="/sprites/acgrassfield.png" 
              alt="Grass field" 
              className="h-48"
            />
          </div>
          <div className="fixed bottom-[-63px] left-[200vw] z-1 pointer-events-none">
            <img 
              src="/sprites/acgrassfield.png" 
              alt="Grass field" 
              className="h-48"
            />
          </div>



          
          {/* Sun/Moon and clouds gliding above the grass field */}
          <div className="fixed bottom-20 animate-sun-moon-glide z-30 pointer-events-none">
            <img 
              src={isDaytime ? "/sprites/acsun.png" : "/sprites/acmoon.png"}
              alt={isDaytime ? "Sun" : "Moon"}
              className="w-14 h-14"
            />
          </div>
          
          {/* Floating clouds above the grass field */}
          <div className="fixed bottom-24 animate-cloud-glide-1 z-20 pointer-events-none">
            <img 
              src="/sprites/accloud.png" 
              alt="Cloud" 
              className="w-18 h-18"
            />
          </div>
          
          <div className="fixed bottom-28 animate-cloud-glide-2 z-20 pointer-events-none">
            <img 
              src="/sprites/accloud.png" 
              alt="Cloud" 
              className="w-14 h-14"
            />
          </div>
          
          <div className="fixed bottom-22 animate-cloud-glide-3 z-20 pointer-events-none">
            <img 
              src="/sprites/accloud.png" 
              alt="Cloud" 
              className="w-16 h-16"
            />
          </div>
          
          {/* Bigger bushes scattered randomly across the grass */}
          <div className="fixed bottom-1 left-[5%] z-25 pointer-events-none">
            <img 
              src="/sprites/acbush.png" 
              alt="Bush" 
              className="w-10 h-10"
            />
          </div>
          <div className="fixed bottom-0 left-[20%] z-20 pointer-events-none">
            <img 
              src="/sprites/acbush.png" 
              alt="Bush" 
              className="w-8 h-8"
            />
          </div>
          <div className="fixed bottom-2 left-[40%] z-30 pointer-events-none">
            <img 
              src="/sprites/acbush.png" 
              alt="Bush" 
              className="w-12 h-12"
            />
          </div>
          <div className="fixed bottom-0 left-[60%] z-25 pointer-events-none">
            <img 
              src="/sprites/acbush.png" 
              alt="Bush" 
              className="w-9 h-9"
            />
          </div>
          <div className="fixed bottom-1 left-[80%] z-20 pointer-events-none">
            <img 
              src="/sprites/acbush.png" 
              alt="Bush" 
              className="w-11 h-11"
            />
          </div>
          <div className="fixed bottom-0 right-[15%] z-30 pointer-events-none">
            <img 
              src="/sprites/acbush.png" 
              alt="Bush" 
              className="w-7 h-7"
            />
          </div>
          
          {/* Bigger flowers scattered randomly across the grass */}
          <div className="fixed bottom-4 left-25 z-25 pointer-events-none">
            <img 
              src="/sprites/acflower.png" 
              alt="Flower" 
              className="w-8 h-8"
            />
          </div>
          <div className="fixed bottom-2 left-85 z-20 pointer-events-none">
            <img 
              src="/sprites/acflower.png" 
              alt="Flower" 
              className="w-6 h-6"
            />
          </div>
          <div className="fixed bottom-3 left-145 z-30 pointer-events-none">
            <img 
              src="/sprites/acflower.png" 
              alt="Flower" 
              className="w-9 h-9"
            />
          </div>
          <div className="fixed bottom-1 right-25 z-25 pointer-events-none">
            <img 
              src="/sprites/acflower.png" 
              alt="Flower" 
              className="w-7 h-7"
            />
          </div>
          <div className="fixed bottom-4 right-85 z-20 pointer-events-none">
            <img 
              src="/sprites/acflower.png" 
              alt="Flower" 
              className="w-10 h-10"
            />
          </div>
          <div className="fixed bottom-2 right-125 z-30 pointer-events-none">
            <img 
              src="/sprites/acflower.png" 
              alt="Flower" 
              className="w-8 h-8"
            />
          </div>
          <div className="fixed bottom-3 left-55 z-25 pointer-events-none">
            <img 
              src="/sprites/acflower.png" 
              alt="Flower" 
              className="w-6 h-6"
            />
          </div>
          <div className="fixed bottom-1 left-115 z-20 pointer-events-none">
            <img 
              src="/sprites/acflower.png" 
              alt="Flower" 
              className="w-9 h-9"
            />
          </div>
          
          {/* Boba on the right side of the grass field */}
          <div className="fixed bottom-0 right-8 z-20 pointer-events-none">
            <img 
              src="/sprites/boba.png" 
              alt="Boba" 
              className="w-40 h-40"
            />
          </div>
          
          {/* Bushes scattered around */}
          <div className="fixed bottom-1 left-[10%] z-20 pointer-events-none">
            <img 
              src="/sprites/acbush.png" 
              alt="Bush" 
              className="w-5 h-5"
              
            />
          </div>
          <div className="fixed bottom-3 left-[30%] z-20 pointer-events-none">
            <img 
              src="/sprites/acbush.png" 
              alt="Bush" 
              className="w-5 h-5"
              
            />
          </div>
          <div className="fixed bottom-1 left-[90%] z-20 pointer-events-none">
            <img 
              src="/sprites/acbush.png" 
              alt="Bush" 
              className="w-5 h-5"
              
            />
          </div>
          
          {/* Bushes scattered around */}
          <div className="fixed bottom-2 left-[15%] z-20 pointer-events-none">
            <img 
              src="/sprites/acbush.png" 
              alt="Bush" 
              className="w-7 h-7"
              
            />
          </div>
          <div className="fixed bottom-2 left-[50%] z-20 pointer-events-none">
            <img 
              src="/sprites/acbush.png" 
              alt="Bush" 
              className="w-7 h-7"
              
            />
          </div>
          <div className="fixed bottom-2 left-[85%] z-20 pointer-events-none">
            <img 
              src="/sprites/acbush.png" 
              alt="Bush" 
              className="w-7 h-7"
              
            />
          </div>
          
          {/* Trees scattered around - Always in front */}
          <div className="fixed bottom-0 left-30 z-40 pointer-events-none">
            <img 
              src="/sprites/actree.png" 
              alt="Tree" 
              className="w-16 h-16"
              
            />
          </div>
          <div className="fixed bottom-0 left-90 z-40 pointer-events-none">
            <img 
              src="/sprites/actree.png" 
              alt="Tree" 
              className="w-16 h-16"
              
            />
          </div>
          <div className="fixed bottom-0 right-50 z-40 pointer-events-none">
            <img 
              src="/sprites/actree.png" 
              alt="Tree" 
              className="w-16 h-16"
              
            />
          </div>
          
          {/* Brown Bunny - Random chaos on top of grass */}
          <div 
            className="fixed bottom-6 left-20 animate-bunny-chaos-1 z-35 cursor-pointer hover:scale-110 transition-transform duration-200"
            onClick={playBrownBunnySound}
            title="Click me for a cute sound! 🐰"
          >
            <img 
              src="/sprites/acbrownbunny.png" 
              alt="Brown rabbit" 
              className="w-16 h-16"
              
            />
          </div>
          
          {/* White Bunny - Random chaos on top of grass */}
          <div 
            className="fixed bottom-6 right-20 animate-bunny-chaos-2 z-35 cursor-pointer hover:scale-110 transition-transform duration-200"
            onClick={playWhiteBunnySound}
            title="Click me for a cute sound! 🐰"
          >
            <img 
              src="/sprites/acwhitebunny.png" 
              alt="White rabbit" 
              className="w-12 h-12"
              
            />
          </div>
        </>
      )}
      
      <style jsx>{`
  @keyframes bunny-walk-1 {
    0% { left: 15%; bottom: 8; }
    25% { left: 30%; bottom: 8; }
    50% { left: 50%; bottom: 8; }
    75% { left: 70%; bottom: 8; }
    100% { left: 15%; bottom: 8; }
  }
  
  @keyframes bunny-walk-2 {
    0% { right: 15%; bottom: 8; }
    25% { right: 35%; bottom: 8; }
    50% { right: 55%; bottom: 8; }
    75% { right: 75%; bottom: 8; }
    100% { right: 15%; bottom: 8; }
  }
  
  .animate-bunny-chaos-1 {
    animation: bunny-walk-1 80s ease-in-out infinite;
  }
  
  .animate-bunny-chaos-2 {
    animation: bunny-walk-2 60s ease-in-out infinite;
  }
  
  .animate-sun-moon-glide {
    animation: sun-moon-glide 60s linear infinite;
  }
  
  .animate-cloud-glide-1 {
    animation: cloud-glide-1 45s linear infinite;
  }
  
  .animate-cloud-glide-2 {
    animation: cloud-glide-2 70s linear infinite;
  }
  
  .animate-cloud-glide-3 {
    animation: cloud-glide-3 55s linear infinite;
  }
  
  @keyframes sun-moon-glide {
    0% { left: 5%; }
    50% { left: 85%; }
    100% { left: 5%; }
  }
  
  @keyframes cloud-glide-1 {
    0% { left: 10%; }
    50% { left: 80%; }
    100% { left: 10%; }
  }
  
  @keyframes cloud-glide-2 {
    0% { left: 15%; }
    50% { left: 75%; }
    100% { left: 15%; }
  }
  
  @keyframes cloud-glide-3 {
    0% { left: 20%; }
    50% { left: 70%; }
    100% { left: 20%; }
  }
`}</style>
      
      {/* Export sound functions for use in other components */}
      {(() => {
        (window as any).playCorrectSound = playCorrectSound;
        (window as any).playWrongSound = playWrongSound;
        return null;
      })()}
    </>
  );
}
