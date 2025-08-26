'use client'

import { ArrowLeft, Music, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function SpotifyPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold">Spotify Player</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <a
                href="https://open.spotify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 transition-colors flex items-center gap-2 text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Open in Spotify
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Spotify Web Player iframe */}
      <div className="h-[calc(100vh-80px)] w-full">
        <iframe
          src="https://open.spotify.com/embed"
          width="100%"
          height="100%"
          frameBorder="0"
          allow="encrypted-media"
          title="Spotify Web Player"
          className="w-full h-full"
        />
      </div>

      {/* Info Banner */}
      <div className="fixed bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-center text-sm text-gray-300">
        <p>
          💡 <strong>Tip:</strong> The Spotify Web Player requires you to be logged into Spotify. 
          If you see a login page, please sign in with your Spotify account.
        </p>
      </div>
    </div>
  )
}
