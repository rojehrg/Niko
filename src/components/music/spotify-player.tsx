"use client";

import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Search, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Spotify Web Playback SDK types
interface SpotifyPlayer {
  connect(): Promise<boolean>;
  disconnect(): void;
  getCurrentState(): Promise<SpotifyState | null>;
  activateElement(): Promise<void>;
  setVolume(volume: number): void;
  addListener(event: string, callback: (data: any) => void): void;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: { name: string; images: Array<{ url: string }> };
  duration_ms: number;
  uri: string;
}

interface SpotifyPlaylist {
  id: string;
  name: string;
  images: Array<{ url: string }>;
  tracks: { total: number };
  uri: string;
}

interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
  };
}

interface SpotifyState {
  track_window: {
    current_track: SpotifyTrack;
  };
  position: number;
  duration: number;
  paused: boolean;
  shuffle: boolean;
  repeat_mode: number;
}

declare global {
  interface Window {
    Spotify: {
      Player: new (config: {
        name: string;
        getOAuthToken: (callback: (token: string) => void) => void;
        volume: number;
      }) => SpotifyPlayer;
    };
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

const CLIENT_ID = 'b4900b67b52a49a096e059ecf09a2fb2';
const REDIRECT_URI = typeof window !== 'undefined' ? 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:3001/callback' 
    : `${window.location.origin}/callback`) 
  : 'http://localhost:3001/callback';

const SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-library-read',
  'user-library-modify',
  'user-read-playback-state',
  'user-modify-playback-state',
  'playlist-read-private',
  'playlist-modify-public',
  'playlist-modify-private'
].join(' ');

export default function SpotifyPlayer() {
  const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [showPlaylists, setShowPlaylists] = useState(false);

  // TEST: Add this to see if component is rendering
  console.log('SpotifyPlayer component is rendering!');

  // Initialize Spotify Web Playback SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Niko Music Player',
        getOAuthToken: cb => {
          // Get token from localStorage or redirect to auth
          const token = localStorage.getItem('spotify_access_token');
          if (token) {
            cb(token);
          } else {
            // Redirect to Spotify auth
            const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;
            window.location.href = authUrl;
          }
        },
        volume: volume / 100
      });

      // Error handling
      player.addListener('initialization_error', ({ message }) => {
        console.error('Failed to initialize:', message);
      });

      player.addListener('authentication_error', ({ message }) => {
        console.error('Failed to authenticate:', message);
        localStorage.removeItem('spotify_access_token');
        // Redirect to auth again
        const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;
        window.location.href = authUrl;
      });

      player.addListener('account_error', ({ message }) => {
        console.error('Failed to validate Spotify account:', message);
      });

      player.addListener('playback_error', ({ message }) => {
        console.error('Failed to perform playback:', message);
      });

      // Playback status updates
      player.addListener('player_state_changed', (state: SpotifyState) => {
        if (state) {
          setCurrentTrack(state.track_window.current_track);
          setIsPlaying(!state.paused);
          setProgress(state.position);
        }
      });

      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setIsActive(true);
        localStorage.setItem('spotify_device_id', device_id);
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
        setIsActive(false);
      });

      // Connect to the player
      player.connect().then(success => {
        if (success) {
          console.log('Successfully connected to Spotify!');
        }
      });

      setPlayer(player);
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, []);

  // Handle auth callback
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token'))?.split('=')[1];
      if (token) {
        localStorage.setItem('spotify_access_token', token);
        // Remove hash from URL
        window.history.pushState('', document.title, window.location.pathname);
        // Reload to reinitialize player
        window.location.reload();
      }
    }
  }, []);

  // Control functions
  const togglePlay = useCallback(() => {
    if (player) {
      player.getCurrentState().then(state => {
        if (state) {
          if (state.paused) {
            // Resume playback
            fetch('https://api.spotify.com/v1/me/player/play', {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('spotify_access_token')}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                device_id: localStorage.getItem('spotify_device_id')
              })
            });
          } else {
            // Pause playback
            fetch('https://api.spotify.com/v1/me/player/pause', {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('spotify_access_token')}`
              }
            });
          }
        }
      });
    }
  }, [player]);

  const skipNext = useCallback(() => {
    fetch('https://api.spotify.com/v1/me/player/next', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('spotify_access_token')}`
      }
    });
  }, []);

  const skipPrevious = useCallback(() => {
    fetch('https://api.spotify.com/v1/me/player/previous', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('spotify_access_token')}`
      }
    });
  }, []);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (player) {
      player.setVolume(newVolume / 100);
    }
  }, [player]);

  // Search functionality
  const searchSpotify = useCallback(async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=10`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('spotify_access_token')}`
          }
        }
      );
      const data: SpotifySearchResponse = await response.json();
      setSearchResults(data.tracks?.items || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const playTrack = useCallback(async (trackUri: string) => {
    try {
      await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('spotify_access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: [trackUri],
          device_id: localStorage.getItem('spotify_device_id')
        })
      });
    } catch (error) {
      console.error('Failed to play track:', error);
    }
  }, []);

  // Load user playlists
  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=20', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('spotify_access_token')}`
          }
        });
        const data = await response.json();
        setUserPlaylists(data.items || []);
      } catch (error) {
        console.error('Failed to load playlists:', error);
      }
    };

    if (localStorage.getItem('spotify_access_token')) {
      loadPlaylists();
    }
  }, []);

  if (!isActive) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎵 Spotify Music Player
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-[var(--foreground-secondary)] mb-4">
            {localStorage.getItem('spotify_access_token') 
              ? 'Connecting to Spotify...' 
              : 'Connect your Spotify account to start listening'
            }
          </p>
          {!localStorage.getItem('spotify_access_token') && (
            <Button 
              onClick={() => {
                const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;
                window.location.href = authUrl;
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Connect Spotify
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg">
      {/* TEST ELEMENT - This should always be visible */}
      <div className="bg-red-1000 text-white p-4 text-center font-bold">
        🎵 SPOTIFY PLAYER IS RENDERING! 🎵
      </div>
      
      <CardHeader className="pb-6 border-b border-[var(--border)] bg-[var(--background-secondary)] rounded-t-xl">
        <CardTitle className="flex items-center gap-2">
          🎵 Now Playing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Track */}
        {currentTrack && (
          <div className="text-center">
            <img 
              src={currentTrack.album.images[0]?.url} 
              alt={currentTrack.album.name}
              className="w-32 h-32 mx-auto rounded-lg shadow-lg mb-4"
            />
            <h3 className="font-semibold text-[var(--foreground)] text-lg mb-1">
              {currentTrack.name}
            </h3>
            <p className="text-[var(--foreground-secondary)] mb-2">
              {currentTrack.artists.map(a => a.name).join(', ')}
            </p>
            <p className="text-sm text-[var(--foreground-tertiary)]">
              {currentTrack.album.name}
            </p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-[var(--hover)] rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(progress / (currentTrack?.duration_ms || 1)) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-[var(--foreground-secondary)]">
            <span>{Math.floor(progress / 1000)}s</span>
            <span>{Math.floor((currentTrack?.duration_ms || 0) / 1000)}s</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={skipPrevious}
            className="rounded-full w-10 h-10 p-0"
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={togglePlay}
            className="rounded-full w-12 h-12 p-0 bg-green-600 hover:bg-green-700"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={skipNext}
            className="rounded-full w-10 h-10 p-0"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3">
          <Volume2 className="w-4 h-4 text-[var(--foreground-secondary)]" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="flex-1 h-2 bg-[var(--hover)] rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm text-[var(--foreground-secondary)] w-8">
            {volume}%
          </span>
        </div>

        {/* Search */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Search for songs, artists, albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchSpotify()}
              className="flex-1"
            />
            <Button onClick={searchSpotify} disabled={isSearching}>
              <Search className="w-4 h-4" />
            </Button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {searchResults.map((track: SpotifyTrack) => (
                <div
                  key={track.id}
                  className="flex items-center gap-3 p-2 hover:bg-[var(--hover)] rounded-lg cursor-pointer"
                  onClick={() => playTrack(track.uri)}
                >
                  <img 
                    src={track.album.images[0]?.url} 
                    alt={track.name}
                    className="w-10 h-10 rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-[var(--foreground)] truncate">
                      {track.name}
                    </p>
                    <p className="text-xs text-[var(--foreground-secondary)] truncate">
                      {track.artists.map((a: { name: string }) => a.name).join(', ')}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Play className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Playlists */}
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={() => setShowPlaylists(!showPlaylists)}
            className="w-full"
          >
            <List className="w-4 h-4 mr-2" />
            {showPlaylists ? 'Hide' : 'Show'} Playlists
          </Button>
          
          {showPlaylists && userPlaylists.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {userPlaylists.map((playlist: SpotifyPlaylist) => (
                <div
                  key={playlist.id}
                  className="flex items-center gap-3 p-2 hover:bg-[var(--hover)] rounded-lg cursor-pointer"
                  onClick={() => playTrack(playlist.uri)}
                >
                  <img 
                    src={playlist.images[0]?.url} 
                    alt={playlist.name}
                    className="w-10 h-10 rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-[var(--foreground)] truncate">
                      {playlist.name}
                    </p>
                    <p className="text-xs text-[var(--foreground-secondary)] truncate">
                      {playlist.tracks.total} tracks
                    </p>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Play className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
