'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [showPasscode, setShowPasscode] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);



  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (passcode === '0802') {
      setError('');
      // Redirect to dashboard after correct passcode
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } else {
      setError('Incorrect passcode. Please try again.');
      setPasscode('');
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] relative">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video 
          src="/sprites/vid.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
      <div className="text-center max-w-md w-full px-6 relative z-10">
        <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-8">
          <div className="text-4xl font-bold text-[var(--foreground)] mb-4">
            LETS GET THESE GRADES!!!!!
          </div>
          <div className="text-[var(--foreground-secondary)] mb-6">
            Made by Mr.Slime himself, to Nikho
          </div>
          

          <form onSubmit={handlePasscodeSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode"
                className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200 text-center text-lg font-mono"
                maxLength={4}
                autoFocus
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm font-medium">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading || passcode.length !== 4}
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:bg-[var(--foreground-tertiary)] text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Checking...' : 'Enter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


