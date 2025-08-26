"use client";

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/lib/contexts/auth-context';

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
  y: number;
  speed: number;
  rotation: number;
  scale: number;
  opacity: number;
  sway: number;
  swaySpeed: number;
  swayAmount: number;
}

export function FloatingEmojis() {
  const [emojis, setEmojis] = useState<FloatingEmoji[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { userProfile } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<string>('general');

  // Get emojis based on selected subject
  const getEmojisForSubject = (subject: string) => {
    switch (subject) {
      case 'biology':
        return ['🧬', '🌱', '🔬', '🦠', '🧫', '🌿', '🧍', '🦎', '🦋', '🌸', '🌺', '🌻', '🌳', '🌲', '🍄', '🦠', '🧬', '🦴', '🫀', '🫁', '🧠', '🩸', '💉', '🩹', '🩺', '🚑', '⚕️'];
      case 'chemistry':
        return ['⚗️', '🧪', '🔥', '💨', '🧊', '🔮', '💥', '⚡', '🌪️', '💧', '💦', '🌊', '☁️', '🌫️', '💨', '🔥', '💥', '⚡', '🧪', '⚗️', '🔬', '🔭', '📊', '📈', '📉'];
      case 'physics':
        return ['⚡', '🌌', '🛰️', '🌠', '🔭', '🪐', '📡', '🌍', '🌙', '☀️', '⭐', '🌟', '💫', '✨', '🔋', '💡', '🔌', '⚡', '🌊', '🌪️', '🔥', '💥', '🧲', '⚖️', '📏', '📐'];
      case 'mathematics':
        return ['📐', '➗', '🔢', '✖️', '➕', '📊', '📏', '🔺', '🔻', '⭕', '🔴', '🔵', '🟡', '🟢', '🟣', '⚫', '⚪', '🔶', '🔷', '💎', '💠', '🔸', '🔹', '🔻', '🔺'];
      case 'computer-science':
        return ['💻', '🤖', '📊', '📱', '🖥️', '🔧', '👨‍💻', '👩‍💻', '⌨️', '🖱️', '🖲️', '💾', '💿', '📀', '🔌', '🔋', '💡', '🔍', '🔎', '📡', '🛰️', '🌐', '🔗', '🔒', '🔓', '🔐'];
      case 'pa':
        return ['🏥', '💊', '🩺', '🩻', '🦴', '🧬', '🫀', '🫁', '🧠', '🩸', '💉', '🩹', '🚑', '⚕️', '👨‍⚕️', '👩‍⚕️', '🏨', '💊', '💉', '🩺', '🩻', '🦴', '🧬', '🫀', '🫁', '🧠', '🩸'];
      case 'english':
        return ['📚', '✍️', '📝', '📰', '🖋️', '📖', '📜', '📄', '📃', '📑', '🔖', '📌', '📍', '📎', '🖇️', '📐', '✏️', '🖊️', '🖌️', '🖍️', '✂️', '🗂️', '📁', '📂', '🗄️', '📋'];
      case 'history':
        return ['📜', '🏛️', '🗿', '⚔️', '📯', '🏺', '⛩️', '🏰', '🏯', '🗼', '🗽', '🏛️', '🏺', '📜', '⚔️', '🛡️', '🗡️', '⚔️', '🏹', '🛡️', '🗿', '🏺', '📜', '⚔️', '🏛️', '🗿'];
      case 'geography':
        return ['🌍', '🗺️', '⛰️', '🌊', '🏕️', '🏜️', '🏝️', '🏔️', '🌋', '🏖️', '🏞️', '🏟️', '🏗️', '🏘️', '🏙️', '🏚️', '🏛️', '🏜️', '🏝️', '🏞️', '🏟️', '🏠', '🏡', '🏢', '🏣', '🏤'];
      case 'economics':
        return ['💰', '📈', '🏦', '📉', '🪙', '💳', '🛒', '💵', '💴', '💶', '💷', '🪙', '💎', '💠', '🔶', '🔷', '💎', '💠', '🔶', '🔷', '💎', '💠', '🔶', '🔷', '💎', '💠'];
      case 'psychology':
        return ['🧠', '💭', '🔎', '📘', '🤯', '😌', '👥', '🤔', '💡', '🔍', '🔎', '📊', '📈', '📉', '📊', '📈', '📉', '📊', '📈', '📉', '📊', '📈', '📉', '📊', '📈', '📉'];
      case 'art':
        return ['🎨', '🖌️', '🖼️', '🖍️', '✏️', '🎭', '🪡', '🧵', '🪢', '🧶', '🪡', '🧵', '🪢', '🧶', '🪡', '🧵', '🪢', '🧶', '🪡', '🧵', '🪢', '🧶', '🪡', '🧵', '🪢', '🧶'];
      case 'music':
        return ['🎵', '🎶', '🎹', '🥁', '🎸', '🎤', '🎷', '🎺', '🎻', '🪕', '🪘', '🎼', '🎤', '🎧', '🎼', '🎤', '🎧', '🎼', '🎤', '🎧', '🎼', '🎤', '🎧', '🎼', '🎤', '🎧'];
      case 'sports':
        return ['⚽', '🏀', '🏋️', '🎾', '🏈', '⚾', '🥇', '🏆', '🎯', '🎳', '🏓', '🏸', '🏒', '🏑', '🏏', '🏐', '🏉', '🎱', '🏓', '🏸', '🏒', '🏑', '🏏', '🏐', '🏉', '🎱'];
      default:
        return ['🌟', '✨', '💫', '⭐', '🌙', '☀️', '🌈', '🎈', '🎉', '🎊', '🎋', '🎍', '🎎', '🎏', '🎐', '🎀', '🎁', '🎂', '🎃', '🎄', '🎅', '🎆', '🎇', '🎈', '🎉', '🎊'];
    }
  };

  // Update selected subject when userProfile changes
  useEffect(() => {
    if (userProfile?.selectedSubject) {
      setSelectedSubject(userProfile.selectedSubject);
    }
  }, [userProfile]);

  // Mix of nature and medical emojis - moved outside component to prevent recreation
  const emojiList = useMemo(() => getEmojisForSubject(selectedSubject), [selectedSubject]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Create initial emoji with snow-like properties
    const createEmoji = (id: number): FloatingEmoji => ({
      id,
      emoji: emojiList[Math.floor(Math.random() * emojiList.length)],
      x: Math.random() * 120, // percentage - extend beyond 100% for full coverage
      y: -20, // start above screen
      speed: 0.04 + Math.random() * 0.12, // varied fall speed
      rotation: Math.random() * 360,
      scale: 0.8 + Math.random() * 1.2, // 0.8 to 2.0 (much bigger size)
      opacity: 0.3 + Math.random() * 0.3, // 0.3 to 0.6 (more transparent)
      sway: Math.random() * Math.PI * 2, // random starting sway phase
      swaySpeed: 0.02 + Math.random() * 0.03, // sway speed
      swayAmount: 0.8 + Math.random() * 2.0, // sway amount
    });

    // Initialize with many more emojis for full page coverage
    const initialEmojis = Array.from({ length: 25 }, (_, i) => {
      const emoji = createEmoji(i);
      emoji.y = Math.random() * 140; // spread them across screen initially
      emoji.x = Math.random() * 120; // spread horizontally across full width
      return emoji;
    });

    setEmojis(initialEmojis);

    let emojiId = initialEmojis.length;

    const animateEmojis = () => {
      setEmojis(prevEmojis => {
        const updatedEmojis = prevEmojis
          .map(emoji => ({
            ...emoji,
            y: emoji.y + emoji.speed,
            rotation: emoji.rotation + 0.1, // very slow rotation
            sway: emoji.sway + emoji.swaySpeed, // update sway phase
            x: emoji.x + Math.sin(emoji.sway) * emoji.swayAmount * 0.015, // gentle side-to-side sway like snow
          }))
          .filter(emoji => emoji.y < 120); // remove emojis that fall off screen

        // Constantly add new emojis for continuous rain effect
        if (Math.random() < 0.015 && updatedEmojis.length < 35) { // high spawn rate and max count
          const newEmoji = createEmoji(emojiId++);
          newEmoji.x = Math.random() * 120; // random horizontal position
          updatedEmojis.push(newEmoji);
        }

        return updatedEmojis;
      });
    };

    const interval = setInterval(animateEmojis, 80); // faster animation updates for smoother rain

    return () => clearInterval(interval);
  }, [isClient]);



  if (!isClient) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {emojis.map(emoji => (
        <div
          key={emoji.id}
          className="absolute text-3xl transition-all duration-75 ease-out"
          style={{
            left: `${emoji.x}%`,
            top: `${emoji.y}%`,
            transform: `rotate(${emoji.rotation}deg) scale(${emoji.scale})`,
            opacity: emoji.opacity,
            filter: 'blur(0.2px)', // minimal blur for crisp appearance
          }}
        >
          {emoji.emoji}
        </div>
      ))}
    </div>
  );
}
