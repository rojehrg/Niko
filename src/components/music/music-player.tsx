"use client";

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, Shuffle, Repeat } from 'lucide-react';

interface Track {
  id: string;
  name: string;
  artist: string;
  duration: string;
  audio: string;
  category: string;
}

interface MusicPlayerProps {
  isVisible: boolean;
  onToggle: () => void;
}

// Curated study music tracks (using free royalty-free sources)
const STUDY_TRACKS: Track[] = [
  // Nature & Ambient Sounds
  {
    id: '1',
    name: 'Ocean Waves',
    artist: 'Nature Sounds',
    duration: '60:00',
    audio: 'https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg',
    category: 'Nature'
  },
  {
    id: '2',
    name: 'Rain & Thunder',
    artist: 'Nature Sounds',
    duration: '45:00',
    audio: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3',
    category: 'Nature'
  },
  {
    id: '3',
    name: 'Forest Ambience',
    artist: 'Nature Sounds',
    duration: '30:00',
    audio: 'https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg',
    category: 'Nature'
  },
  {
    id: '4',
    name: 'White Noise',
    artist: 'Focus Sounds',
    duration: '90:00',
    audio: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
    category: 'Focus'
  },
  {
    id: '5',
    name: 'Coffee Shop Ambience',
    artist: 'Ambient Sounds',
    duration: '40:00',
    audio: 'https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg',
    category: 'Ambient'
  },
  // 80s & 90s Disco
  {
    id: '6',
    name: 'Disco Groove',
    artist: 'Retro Vibes',
    duration: '3:45',
    audio: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3',
    category: 'Disco'
  },
  {
    id: '7',
    name: '80s Synthwave',
    artist: 'Retro Vibes',
    duration: '4:20',
    audio: 'https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg',
    category: 'Disco'
  },
  {
    id: '8',
    name: '90s House Beat',
    artist: 'Retro Vibes',
    duration: '3:55',
    audio: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
    category: 'Disco'
  },
  // Peruvian Music
  {
    id: '9',
    name: 'Andean Flute',
    artist: 'Peruvian Folk',
    duration: '5:15',
    audio: 'https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg',
    category: 'Peruvian'
  },
  {
    id: '10',
    name: 'Cumbia Peruana',
    artist: 'Peruvian Folk',
    duration: '4:30',
    audio: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3',
    category: 'Peruvian'
  },
  {
    id: '11',
    name: 'Huayno Melody',
    artist: 'Peruvian Folk',
    duration: '6:00',
    audio: 'https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg',
    category: 'Peruvian'
  },
  // Study & Focus
  {
    id: '12',
    name: 'Lo-fi Beats',
    artist: 'Study Sounds',
    duration: '45:00',
    audio: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
    category: 'Focus'
  },
  {
    id: '13',
    name: 'Classical Piano',
    artist: 'Study Sounds',
    duration: '50:00',
    audio: 'https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg',
    category: 'Focus'
  }
];

export function MusicPlayer({ isVisible, onToggle }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isLooped, setIsLooped] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const categories = ['All', 'Nature', 'Focus', 'Ambient', 'Disco', 'Peruvian'];
  
  const filteredTracks = selectedCategory === 'All' 
    ? STUDY_TRACKS 
    : STUDY_TRACKS.filter(track => track.category === selectedCategory);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setProgress(audio.currentTime);
    const updateDuration = () => setProgress(audio.duration);
    const handleEnd = () => {
      if (isLooped) {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnd);
    };
  }, [currentTrackIndex, isLooped]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    }
  };

  const handleNext = () => {
    if (filteredTracks.length === 0) return;
    
    let nextIndex;
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * filteredTracks.length);
    } else {
      nextIndex = (currentTrackIndex + 1) % filteredTracks.length;
    }
    
    setCurrentTrackIndex(nextIndex);
    setProgress(0); // Reset progress when changing track
  };

  const handlePrevious = () => {
    if (filteredTracks.length === 0) return;
    
    const prevIndex = currentTrackIndex === 0 ? filteredTracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    setProgress(0); // Reset progress when changing track
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = (parseFloat(e.target.value) / 100) * progress;
    audio.currentTime = newTime;
    setProgress(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-xl z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--background-secondary)]">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-[var(--primary)]" />
          <span className="text-sm font-medium text-[var(--foreground)]">Study Music</span>
        </div>
        <button
          onClick={onToggle}
          className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
          title="Hide player"
        >
          ×
        </button>
      </div>

      {/* Category Selector */}
      <div className="p-4 border-b border-[var(--border)]">
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--background-secondary)] text-[var(--foreground-secondary)] hover:bg-[var(--hover)]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Current Track Info */}
      {filteredTracks[currentTrackIndex] && (
        <div className="p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[var(--background-secondary)] rounded-lg flex items-center justify-center">
              <Music className="w-6 h-6 text-[var(--primary)]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-[var(--foreground)] truncate">
                {filteredTracks[currentTrackIndex].name}
              </h3>
              <p className="text-xs text-[var(--foreground-secondary)] truncate">
                {filteredTracks[currentTrackIndex].artist}
              </p>
              <span className="inline-block px-2 py-0.5 bg-[var(--background-tertiary)] text-xs text-[var(--foreground-tertiary)] rounded mt-1">
                {filteredTracks[currentTrackIndex].category}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="p-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max="100"
            value={progress ? (progress / 100) * 100 : 0}
            onChange={handleSeek}
            className="w-full h-1 bg-[var(--border)] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[var(--primary)] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-xs text-[var(--foreground-tertiary)] mt-1">
            <span>{formatTime(progress)}</span>
            <span>{filteredTracks[currentTrackIndex]?.duration || '0:00'}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <button
            onClick={() => setIsShuffled(!isShuffled)}
            className={`p-2 rounded-lg transition-colors ${
              isShuffled 
                ? 'text-[var(--primary)] bg-[var(--selected)]' 
                : 'text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--hover)]'
            }`}
            title="Shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </button>
          
          <button
            onClick={handlePrevious}
            className="p-2 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--hover)] rounded-lg transition-colors"
            title="Previous track"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button
            onClick={togglePlay}
            disabled={!filteredTracks[currentTrackIndex]}
            className="p-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>
          
          <button
            onClick={handleNext}
            className="p-2 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--hover)] rounded-lg transition-colors"
            title="Next track"
          >
            <SkipForward className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setIsLooped(!isLooped)}
            className={`p-2 rounded-lg transition-colors ${
              isLooped 
                ? 'text-[var(--primary)] bg-[var(--selected)]' 
                : 'text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--hover)]'
            }`}
            title="Repeat"
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-[var(--foreground-secondary)]" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={handleVolumeChange}
            className="flex-1 h-1 bg-[var(--border)] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[var(--primary)] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>
      </div>

      {/* Audio Element */}
      {filteredTracks[currentTrackIndex]?.audio && (
        <audio
          ref={audioRef}
          src={filteredTracks[currentTrackIndex].audio}
          preload="metadata"
        />
      )}
    </div>
  );
}
