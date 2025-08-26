"use client";

import { useEffect, useState } from 'react';

interface Emoji {
  id: number;
  emoji: string;
  x: number;
  y: number;
  speed: number;
  direction: number;
}

export function FloatingEmojis() {
  const [emojis, setEmojis] = useState<Emoji[]>([]);

  // Static default emoji set - no more subject dependency
  const defaultEmojis = ['📚', '✏️', '💡', '🎯', '🚀', '⭐', '💪', '🎉', '🌟', '💭'];

  useEffect(() => {
    // Create initial emojis
    const initialEmojis: Emoji[] = defaultEmojis.map((emoji, index) => ({
      id: index,
      emoji,
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
      speed: 0.5 + Math.random() * 1,
      direction: Math.random() * Math.PI * 2
    }));

    setEmojis(initialEmojis);

    // Animation loop
    const animate = () => {
      setEmojis(prevEmojis => 
        prevEmojis.map(emoji => {
          let newX = emoji.x + Math.cos(emoji.direction) * emoji.speed;
          let newY = emoji.y + Math.sin(emoji.direction) * emoji.speed;

          // Bounce off edges
          if (newX <= 0 || newX >= (typeof window !== 'undefined' ? window.innerWidth : 1200)) {
            emoji.direction = Math.PI - emoji.direction;
            newX = Math.max(0, Math.min(newX, (typeof window !== 'undefined' ? window.innerWidth : 1200)));
          }
          if (newY <= 0 || newY >= (typeof window !== 'undefined' ? window.innerHeight : 800)) {
            emoji.direction = -emoji.direction;
            newY = Math.max(0, Math.min(newY, (typeof window !== 'undefined' ? window.innerHeight : 800)));
          }

          return {
            ...emoji,
            x: newX,
            y: newY
          };
        })
      );
    };

    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setEmojis(prevEmojis => 
        prevEmojis.map(emoji => ({
          ...emoji,
          x: Math.min(emoji.x, window.innerWidth),
          y: Math.min(emoji.y, window.innerHeight)
        }))
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {emojis.map((emoji) => (
        <div
          key={emoji.id}
          className="absolute text-2xl opacity-20 select-none"
          style={{
            left: emoji.x,
            top: emoji.y,
            transform: 'translate(-50%, -50%)',
            transition: 'opacity 0.3s ease-in-out'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.2';
          }}
        >
          {emoji.emoji}
        </div>
      ))}
    </div>
  );
}
