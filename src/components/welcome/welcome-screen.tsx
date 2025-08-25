"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface WelcomeScreenProps {
  onEnter: () => void;
}

// Static particle configurations to avoid hydration issues
const PARTICLE_CONFIGS = [
  { left: 15.5, top: 25.3, duration: 8.2, delay: 0.5 },
  { left: 75.8, top: 15.7, duration: 9.1, delay: 1.2 },
  { left: 45.2, top: 80.4, duration: 10.3, delay: 2.8 },
  { left: 25.6, top: 60.9, duration: 8.7, delay: 0.9 },
  { left: 85.1, top: 35.2, duration: 9.5, delay: 3.1 },
  { left: 65.4, top: 75.8, duration: 8.9, delay: 1.7 },
  { left: 35.7, top: 20.1, duration: 10.1, delay: 2.3 },
  { left: 55.3, top: 45.6, duration: 8.4, delay: 0.8 },
  { left: 95.2, top: 70.3, duration: 9.8, delay: 3.5 },
  { left: 5.8, top: 40.7, duration: 8.6, delay: 1.4 },
  { left: 78.4, top: 85.2, duration: 9.3, delay: 2.1 },
  { left: 38.9, top: 12.4, duration: 10.7, delay: 0.6 },
  { left: 68.1, top: 55.9, duration: 8.8, delay: 2.9 },
  { left: 18.7, top: 90.1, duration: 9.2, delay: 1.1 },
  { left: 88.3, top: 30.5, duration: 10.4, delay: 3.2 },
  { left: 48.6, top: 65.8, duration: 8.5, delay: 0.7 },
  { left: 28.2, top: 8.3, duration: 9.6, delay: 2.6 },
  { left: 72.5, top: 50.2, duration: 8.3, delay: 1.8 },
  { left: 12.4, top: 78.6, duration: 10.2, delay: 3.7 },
  { left: 92.1, top: 22.7, duration: 9.4, delay: 1.3 }
];

export function WelcomeScreen({ onEnter }: WelcomeScreenProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  
  const fullText = "Welcome to your productivity hub, Niko!";
  
  useEffect(() => {
    let currentIndex = 0;
    
    const typeText = () => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
        
        if (currentIndex > fullText.length) {
          setIsTypingComplete(true);
          return; // Stop the loop, don't restart
        }
        
        // Faster typing as requested
        setTimeout(typeText, 80);
      }
    };
    
    typeText();
  }, []);

  // Cursor blinking effect - slower and more pleasant
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 800); // Slower blinking

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
        
        {/* Floating Orbs */}
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-600/20 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: "10%", left: "10%" }}
        />
        
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-purple-400/15 to-pink-600/15 blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          style={{ top: "60%", right: "15%" }}
        />
        
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-cyan-400/10 to-blue-600/10 blur-3xl"
          animate={{
            x: [0, 60, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
          style={{ bottom: "20%", left: "20%" }}
        />

        {/* Subtle Particles */}
        {PARTICLE_CONFIGS.map((config, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: config.duration,
              repeat: Infinity,
              delay: config.delay,
              ease: "easeInOut"
            }}
            style={{
              left: `${config.left}%`,
              top: `${config.top}%`,
            }}
          />
        ))}

        {/* Floating Emojis */}
        {['🌟', '💫', '⭐', '✨', '🎯', '📚', '💡', '🚀'].map((emoji, i) => (
          <motion.div
            key={`emoji-${i}`}
            className="absolute text-2xl pointer-events-none select-none"
            style={{
              left: `${15 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              scale: [0.8, 1.2, 0.8],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut"
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-8 max-w-4xl mx-auto">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl mb-6">
            <span className="text-white font-bold text-3xl">N</span>
          </div>
        </motion.div>

        {/* Typing Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-light text-white mb-4 leading-tight">
            {displayedText}
            <motion.span
              className="inline-block w-0.5 md:w-0.5 bg-gradient-to-b from-blue-400 to-purple-500 ml-0.5 rounded-sm"
              style={{ 
                height: '1em', // Matches text size perfectly
                verticalAlign: 'baseline',
              }}
              animate={{ 
                opacity: showCursor ? 1 : 0.2,
                scale: showCursor ? 1 : 0.8,
              }}
              transition={{ 
                duration: 0.3, 
                ease: "easeInOut" 
              }}
            />
            {isTypingComplete && (
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="ml-3 text-2xl"
              >
                ✨
              </motion.span>
            )}
          </h1>
        </motion.div>

        {/* Enter Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
              <motion.button
                onClick={onEnter}
                className="relative px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium text-lg rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 group overflow-hidden"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Button shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                
                <span className="relative z-10 flex items-center gap-2">
                  Let&apos;s do it
                  <motion.span
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    🚀
                  </motion.span>
                </span>
              </motion.button>

              {/* Floating hearts around button */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-pink-300 pointer-events-none"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${-10 + (i % 2) * 20}px`,
                  }}
                  animate={{
                    y: [-10, -30, -10],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut"
                  }}
                >
                  💝
                </motion.div>
              ))}
            </motion.div>
      </div>

      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>
    </div>
  );
}
