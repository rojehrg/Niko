"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // This page handles the Spotify auth callback
    // The actual token processing happens in the SpotifyPlayer component
    // We just need to redirect back to the main app
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold text-[var(--foreground)] mb-2">
          Connecting to Spotify...
        </h1>
        <p className="text-[var(--foreground-secondary)]">
          Please wait while we complete your authentication
        </p>
      </div>
    </div>
  );
}
